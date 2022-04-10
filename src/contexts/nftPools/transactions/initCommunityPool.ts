import { PublicKey } from '@solana/web3.js';
import { initCommunityPool } from '@frakters/community-pools-client-library-v2';

import {
  signAndConfirmTransaction,
  WalletAndConnection,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';
import { Provider } from '@project-serum/anchor';

export const rawInitCommunityPool = async ({
  connection,
  wallet,
}: WalletAndConnection): Promise<void> => {
  await initCommunityPool({
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
  });
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawInitCommunityPool, {
  onErrorMessage: { message: 'Transaction failed' },
});

export const createCommunityPool = wrappedAsyncWithTryCatch;
