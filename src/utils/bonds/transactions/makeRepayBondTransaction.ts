import { Loan } from '@frakt/api/loans';
import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { BONDS_ADMIN_PUBKEY, BONDS_PROGRAM_PUBKEY } from '../constants';
import { repayFbondToTradeTransactions } from 'fbonds-core/lib/fbond-protocol/functions/bond/repayment';
import { InstructionsAndSigners } from '@frakt/utils/transactions';
import { chunk } from 'lodash';

type MakeRepayBondTransaction = (params: {
  loan: Loan;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{
  createLookupTableTxn: web3.Transaction;
  extendLookupTableTxns: web3.Transaction[];
  repayIxsAndSigners: InstructionsAndSigners;
}>;

export const makeRepayBondTransaction: MakeRepayBondTransaction = async ({
  loan,
  wallet,
  connection,
}) => {
  const { instructions, signers, addressesForLookupTable } =
    await repayFbondToTradeTransactions({
      args: {
        repayAccounts: loan.bondParams.activeTrades.map((trade) => ({
          bondTradeTransaction: new web3.PublicKey(trade.publicKey),
          user: new web3.PublicKey(trade.user),
          bondOffer: new web3.PublicKey(trade.bondOffer),
        })),
      },
      addComputeUnits: true,
      accounts: {
        admin: new web3.PublicKey(BONDS_ADMIN_PUBKEY),
        fbond: new web3.PublicKey(loan.pubkey),
        userPubkey: wallet.publicKey,
        collateralTokenMint: new web3.PublicKey(loan.nft.mint),
        collateralTokenAccount: new web3.PublicKey(
          loan.bondParams.collateralTokenAccount,
        ),
      },

      connection,
      programId: BONDS_PROGRAM_PUBKEY,
      sendTxn: sendTxnPlaceHolder,
    });

  const slot = await connection.getSlot();

  console.log('INITIAL PASSED SLOT: ', slot);

  console.log('addressesForLookupTable: ', addressesForLookupTable);
  const [lookupTableInst, lookupTableAddress] =
    web3.AddressLookupTableProgram.createLookupTable({
      authority: wallet.publicKey,
      payer: wallet.publicKey,
      recentSlot: slot - 2,
    });
  const extendInstructions = chunk(addressesForLookupTable, 20).map(
    (chunkOfAddressesForLookupTable) =>
      web3.AddressLookupTableProgram.extendLookupTable({
        payer: wallet.publicKey,
        authority: wallet.publicKey,
        lookupTable: lookupTableAddress,
        addresses: chunkOfAddressesForLookupTable,
      }),
  );
  const createLookupTableTxn = new web3.Transaction().add(
    lookupTableInst,
    extendInstructions[0],
  );
  const restExtendInstructions = extendInstructions.slice(
    1,
    extendInstructions.length,
  );

  const restExtendTransactions = restExtendInstructions.map((extendIx) =>
    new web3.Transaction().add(extendIx),
  );

  return {
    createLookupTableTxn: createLookupTableTxn,
    extendLookupTableTxns: restExtendTransactions,
    repayIxsAndSigners: {
      instructions,
      signers,
      lookupTablePublicKeys: [
        {
          tablePubkey: lookupTableAddress,
          addresses: addressesForLookupTable,
        },
      ],
    },
  };
};
