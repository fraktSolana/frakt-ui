import {
  harvestInFusion,
  harvestSecondaryReward,
  unstakeInFusion,
} from '@frakters/frkt-multiple-reward';
import {
  MainRouterView,
  SecondaryRewardView,
} from '@frakters/frkt-multiple-reward/lib/accounts';
import { Provider } from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';

import { wrapAsyncWithTryCatch } from '../../../../utils';
import { FUSION_PROGRAM_PUBKEY } from './constants';
import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';
import BN from 'bn.js';

export interface UnstakeLiquidityTransactionParams {
  router: MainRouterView;
  secondaryReward: SecondaryRewardView[];
  amount: BN;
}

export interface UnstakeLiquidityTransactionRawParams
  extends UnstakeLiquidityTransactionParams,
    WalletAndConnection {}

export const rawUnstakeLiquidity = async ({
  router,
  connection,
  wallet,
  secondaryReward,
  amount,
}: UnstakeLiquidityTransactionRawParams): Promise<void> => {
  const transaction = new Transaction();

  const harvestInstruction = await harvestInFusion(
    new PublicKey(FUSION_PROGRAM_PUBKEY),
    new Provider(connection, wallet, null),
    wallet.publicKey,
    new PublicKey(router.tokenMintInput),
    new PublicKey(router.tokenMintOutput),
  );

  transaction.add(harvestInstruction);

  const rewardsTokenMint = secondaryReward.map(
    ({ tokenMint }) => new PublicKey(tokenMint),
  );

  const secondaryHarvestInstruction = await harvestSecondaryReward(
    new PublicKey(FUSION_PROGRAM_PUBKEY),
    new Provider(connection, wallet, null),
    wallet.publicKey,
    new PublicKey(router.tokenMintInput),
    new PublicKey(router.tokenMintOutput),
    rewardsTokenMint,
  );

  transaction.add(...secondaryHarvestInstruction);

  const unStakeInstruction = await unstakeInFusion(
    new PublicKey(FUSION_PROGRAM_PUBKEY),
    new Provider(connection, wallet, null),
    wallet.publicKey,
    new PublicKey(router.tokenMintInput),
    new PublicKey(router.tokenMintOutput),
    amount,
  );

  transaction.add(unStakeInstruction);

  await signAndConfirmTransaction({
    transaction,
    connection,
    wallet,
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawUnstakeLiquidity, {
  onSuccessMessage: 'Liquidity harvest successfully',
  onErrorMessage: 'Transaction failed',
});

export const unstakeLiquidity = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
