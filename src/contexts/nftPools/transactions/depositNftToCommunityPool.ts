import { PublicKey } from '@solana/web3.js';
import {
  depositNftToCommunityPool as depositNftToCommunityPoolTxn,
  Provider,
} from '@frakters/community-pools-client-library-v2';
import { deriveMetadataPubkeyFromMint } from '@frakters/community-pools-client-library-v2/lib/utils/utils';

import { NftPoolData } from './../../../utils/cacher/nftPools';
import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';

import { getTokenAccount } from '../../../utils/accounts';
import { wrapAsyncWithTryCatch } from '../../../utils';
import { UserNFT } from '../../userTokens';
import {
  getWhitelistedCreatorsDictionary,
  isNFTWhitelistedByCreator,
} from '../nftPools.helpers';

export interface DepositNftToCommunityPoolParams {
  pool: NftPoolData;
  nft: UserNFT;
  poolLpMint: PublicKey;
  afterTransaction?: () => void;
}

export interface DepositNftToCommunityPoolRawParams
  extends DepositNftToCommunityPoolParams,
    WalletAndConnection {}

export const rawDepositNftToCommunityPool = async ({
  connection,
  wallet,
  pool,
  nft,
  poolLpMint,
  afterTransaction,
}: DepositNftToCommunityPoolRawParams): Promise<boolean | null> => {
  const { publicKey: nftUserTokenAccount } = await getTokenAccount({
    tokenMint: new PublicKey(nft.mint),
    owner: wallet.publicKey,
    connection,
  });

  const whitelistedCreatorsDictionary = getWhitelistedCreatorsDictionary(pool);

  const whitelistedCreator: string | null = isNFTWhitelistedByCreator(
    nft,
    whitelistedCreatorsDictionary,
  );

  const metadataInfo = whitelistedCreator
    ? await deriveMetadataPubkeyFromMint(new PublicKey(nft.mint))
    : new PublicKey(nft.mint);

  const poolWhitelist = pool.poolWhitelist.find(({ whitelistedAddress }) => {
    return whitelistedCreator
      ? whitelistedAddress.toBase58() === whitelistedCreator
      : whitelistedAddress.toBase58() === nft.mint;
  });

  await depositNftToCommunityPoolTxn(
    {
      nftMint: new PublicKey(nft.mint),
      communityPool: pool.publicKey,
      poolWhitelist: poolWhitelist.publicKey,
      nftUserTokenAccount,
      fractionMint: pool.fractionMint,
      metadataInfo,
      fusionProgramId: new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      tokenMintInputFusion: poolLpMint,
      feeConfig: new PublicKey(process.env.FEE_CONFIG_GENERAL),
      adminAddress: new PublicKey(process.env.FEE_ADMIN_GENERAL),
    },
    {
      programId: new PublicKey(process.env.COMMUNITY_POOLS_PUBKEY),
      userPubkey: wallet.publicKey,
      provider: new Provider(connection, wallet, null),
      sendTxn: async (transaction, signers) => {
        await signAndConfirmTransaction({
          transaction,
          connection,
          wallet,
          signers,
        });
      },
    },
  );

  afterTransaction && afterTransaction();

  return true;
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(
  rawDepositNftToCommunityPool,
  {
    onSuccessMessage: {
      message: 'NFT deposited successfully',
    },
    onErrorMessage: { message: 'NFT depositing failed' },
  },
);

export const depositNftToCommunityPool = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
