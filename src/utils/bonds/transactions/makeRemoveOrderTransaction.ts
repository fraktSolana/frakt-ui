import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { BONDS_PROGRAM_PUBKEY } from '../constants';
import { removeBondOfferV2 } from 'fbonds-core/lib/fbond-protocol/functions/offer';

type MakeRemoveOrderTransaction = (params: {
  bondOfferV2: web3.PublicKey;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
}>;

export const makeRemoveOrderTransaction: MakeRemoveOrderTransaction = async ({
  bondOfferV2,
  connection,
  wallet,
}) => {
  const { instructions: instructions2, signers: signers2 } =
    await removeBondOfferV2({
      accounts: {
        bondOfferV2: bondOfferV2,
        userPubkey: wallet.publicKey,
      },
      programId: BONDS_PROGRAM_PUBKEY,
      connection,
      sendTxn: sendTxnPlaceHolder,
    });

  return {
    transaction: new web3.Transaction().add(...[instructions2].flat()),
    signers: [...signers2],
  };
};
