import { Bond } from '@frakt/api/bonds';
import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { web3 } from 'fbonds-core';
import { management } from 'fbonds-core/lib/fbond-protocol/functions';
import { claimFbondsFromAutocompoundDeposit } from 'fbonds-core/lib/fbond-protocol/functions/management';
import { BONDS_PROGRAM_PUBKEY } from '../constants';

type MakeRedeemBondTransaction = (params: {
  bond: Bond;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<
  {
    transaction: web3.Transaction;
    signers: web3.Signer[];
  }[]
>;

export const makeRedeemBondTransaction: MakeRedeemBondTransaction = async ({
  bond,
  wallet,
  connection,
}) => {
  if (bond.autocompoundDeposits && bond.autocompoundDeposits.length) {
    const claimAndRedeemTransactionsAndSigners = await Promise.all(
      bond.autocompoundDeposits.map(async (autocompoundDeposit) => {
        const claimIxsAndSigners = await claimFbondsFromAutocompoundDeposit({
          accounts: {
            userPubkey: wallet.publicKey,
            fbond: new web3.PublicKey(bond.fbond.publicKey),
            fbondsTokenMint: new web3.PublicKey(bond.fbond.fbondTokenMint),
            pair: new web3.PublicKey(autocompoundDeposit.bondOffer),
          },
          args: {
            amountToClaim: autocompoundDeposit.amountOfBonds,
          },
          connection,
          programId: BONDS_PROGRAM_PUBKEY,
          sendTxn: sendTxnPlaceHolder,
        });

        const redeemIxsAndSigners = await management.redeemFBonds({
          accounts: {
            fbond: new web3.PublicKey(bond.fbond.publicKey),
            fbondsTokenMint: new web3.PublicKey(bond.fbond.fbondTokenMint),
            userPubkey: wallet.publicKey,
          },
          connection,
          programId: BONDS_PROGRAM_PUBKEY,
          sendTxn: sendTxnPlaceHolder,
        });
        return {
          transaction: new web3.Transaction().add(
            ...claimIxsAndSigners.instructions,
            ...redeemIxsAndSigners.instructions,
          ),
          signers: [
            ...claimIxsAndSigners.signers,
            ...redeemIxsAndSigners.signers,
          ],
        };
      }),
    );
    return claimAndRedeemTransactionsAndSigners;
  }
  const { instructions, signers } = await management.redeemFBonds({
    accounts: {
      fbond: new web3.PublicKey(bond.fbond.publicKey),
      fbondsTokenMint: new web3.PublicKey(bond.fbond.fbondTokenMint),
      userPubkey: wallet.publicKey,
    },
    connection,
    programId: BONDS_PROGRAM_PUBKEY,
    sendTxn: sendTxnPlaceHolder,
  });

  return [
    {
      transaction: new web3.Transaction().add(...instructions),
      signers,
    },
  ];
};
