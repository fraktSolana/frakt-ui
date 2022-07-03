import { utils, web3, pools, TokenInfo, BN } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { FusionPool } from '../../../../contexts/liquidityPools';
import {
  getWhitelistedCreatorsDictionary,
  isNFTWhitelistedByCreator,
} from '../../../../contexts/nftPools';
import { UserNFT } from '../../../../state/userTokens/types';
import { NftPoolData } from '../../../../utils/cacher/nftPools';
import { SELL_COMMISSION_PERCENT } from '../../constants';
import { notify } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../../utils/transactions';
import { captureSentryError } from '../../../../utils/sentry';

type SellNftAndStake = (props: {
  wallet: WalletContextState;
  connection: web3.Connection;
  poolToken: TokenInfo;
  pool: NftPoolData;
  inventoryFusionPool: FusionPool;
  nft: UserNFT;
}) => Promise<boolean>;

export const sellNftAndStake: SellNftAndStake = async ({
  wallet,
  connection,
  pool,
  nft,
  poolToken,
  inventoryFusionPool,
}): Promise<boolean> => {
  try {
    const depositTransaction = new web3.Transaction();

    const { value: nftLargestAccounts } =
      await connection.getTokenLargestAccounts(new web3.PublicKey(nft?.mint));

    const nftUserTokenAccount = nftLargestAccounts?.[0]?.address || null;

    const whitelistedCreatorsDictionary =
      getWhitelistedCreatorsDictionary(pool);

    const whitelistedCreator: string | null = isNFTWhitelistedByCreator(
      nft,
      whitelistedCreatorsDictionary,
    );

    const metadataInfo = whitelistedCreator
      ? await utils.deriveMetadataPubkeyFromMint(new web3.PublicKey(nft.mint))
      : new web3.PublicKey(nft.mint);

    const poolWhitelist = pool.poolWhitelist.find(({ whitelistedAddress }) => {
      return whitelistedCreator
        ? whitelistedAddress.toBase58() === whitelistedCreator
        : whitelistedAddress.toBase58() === nft.mint;
    });

    const tokenMintInputFusion = new web3.PublicKey(
      inventoryFusionPool?.router?.tokenMintInput,
    );

    const {
      instructions: depositInstructions,
      signers: depositInstructionsSigners,
    } = await pools.depositNftToCommunityPoolIx({
      communityPool: pool.publicKey,
      nftMint: new web3.PublicKey(nft.mint),
      nftUserTokenAccount,
      poolWhitelist: poolWhitelist.publicKey,
      fractionMint: pool.fractionMint,
      metadataInfo,
      fusionProgramId: new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      tokenMintInputFusion,
      feeConfig: new web3.PublicKey(process.env.FEE_CONFIG_GENERAL),
      adminAddress: new web3.PublicKey(process.env.FEE_ADMIN_GENERAL),
      programId: new web3.PublicKey(process.env.COMMUNITY_POOLS_PUBKEY),
      userPubkey: wallet.publicKey,
      connection,
    });

    depositTransaction.add(...depositInstructions);

    const stakeTransaction = new web3.Transaction();

    const stakeInstruction = await pools.stakeInFusion(
      new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      connection,
      wallet.publicKey,
      new web3.PublicKey(inventoryFusionPool?.router.tokenMintInput),
      new web3.PublicKey(inventoryFusionPool?.router.tokenMintOutput),
      new BN((1 - SELL_COMMISSION_PERCENT / 100) * 10 ** poolToken?.decimals),
    );

    stakeTransaction.add(stakeInstruction);

    const transactions = [depositTransaction, stakeTransaction];

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    transactions.forEach((transaction) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
    });

    depositTransaction.sign(...depositInstructionsSigners);

    const signedTransactions = await wallet.signAllTransactions(transactions);

    const txidDeposit = await connection.sendRawTransaction(
      signedTransactions[0].serialize(),
      // { skipPreflight: true },
    );

    notify({
      message: 'Transactions sent',
      type: NotifyType.INFO,
    });

    await connection.confirmTransaction(
      { signature: txidDeposit, blockhash, lastValidBlockHeight },
      'finalized',
    );

    const txidStake = await connection.sendRawTransaction(
      signedTransactions[1].serialize(),
      // { skipPreflight: true },
    );

    await connection.confirmTransaction(
      { signature: txidStake, blockhash, lastValidBlockHeight },
      'finalized',
    );

    notify({
      message: 'Staked successfully',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Stake failed',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({
      error,
      wallet,
      transactionName: 'sellNftAndStake',
      params: { pool, nft, poolToken, inventoryFusionPool },
    });

    return false;
  }
};
