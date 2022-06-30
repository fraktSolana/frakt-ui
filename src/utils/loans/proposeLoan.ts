import { web3, loans, BN } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { NotifyType } from '../solanaUtils';
import { notify, SOL_TOKEN } from '../';
import { captureSentryError } from '../sentry';
import {
  signAndConfirmTransaction,
  showSolscanLinkNotification,
} from '../transactions';

type ProposeLoan = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  nftMint: string;
  valuation: number; //? SOL Lamports
  loanToValue: number; //? Percent
  isPriceBased?: boolean;
}) => Promise<boolean>;

export const proposeLoan: ProposeLoan = async ({
  connection,
  wallet,
  nftMint,
  valuation,
  loanToValue: rawloanToValue,
  isPriceBased = false,
}): Promise<boolean> => {
  const proposedNftPrice = valuation * 10 ** SOL_TOKEN.decimals;
  const loanToValue = rawloanToValue * 100; //? Percent 20% ==> 2000

  try {
    const { loanPubkey } = await loans.proposeLoan({
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      connection,
      user: wallet.publicKey,
      nftMint: new web3.PublicKey(nftMint),
      proposedNftPrice: new BN(proposedNftPrice),
      isPriceBased,
      loanToValue: new BN(loanToValue),
      admin: new web3.PublicKey(process.env.LOANS_ADMIN_PUBKEY),
      sendTxn: async (transaction, signers) => {
        await signAndConfirmTransaction({
          transaction,
          signers,
          connection,
          wallet,
          commitment: 'confirmed',
        });
      },
    });

    const subscribtionId = connection.onAccountChange(
      loanPubkey,
      (accountInfo) => {
        const loanAccountData = loans.decodeLoan(
          accountInfo.data,
          connection,
          new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
        );

        if (loanAccountData?.loanStatus?.activated) {
          notify({
            message: 'Your loan was successfully funded!',
            type: NotifyType.SUCCESS,
          });
        } else if (loanAccountData?.loanStatus?.rejected) {
          notify({
            message: 'Loan funding failed. Please get in touch with us',
            type: NotifyType.ERROR,
          });
        }
        connection.removeAccountChangeListener(subscribtionId);
      },
    );

    notify({
      message:
        'We are collateralizing your jpeg. It should take less than a minute',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'The transaction just failed :( Give it another try',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({
      error,
      wallet,
      transactionName: 'proposeLoan',
      params: { nftMint, proposedNftPrice, isPriceBased, loanToValue },
    });

    return false;
  }
};