import axios from 'axios';
import { web3 } from 'fbonds-core';

import { Loan, LoanType, LoansHistory } from './types';
import { patchBorrowValueWithProtocolFee } from '@frakt/pages/BorrowPages/cartState';

const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN;

type FetchWalletLoans = (props: {
  publicKey: web3.PublicKey;
}) => Promise<Loan[]>;

export const fetchWalletLoans: FetchWalletLoans = async ({ publicKey }) => {
  const { data } = await axios.get<Loan[]>(
    `https://${BACKEND_DOMAIN}/loan/all/${publicKey?.toBase58()}`,
  );

  return (data ?? []).map((loan) => ({
    ...loan,
    loanValue:
      loan.loanType === LoanType.BOND
        ? patchBorrowValueWithProtocolFee(loan.loanValue)
        : loan.loanValue,
  }));
};

type FetchLoansHistory = (props: {
  walletPubkey: web3.PublicKey;
}) => Promise<LoansHistory[]>;

export const fetchLoansHistory: FetchLoansHistory = async ({
  walletPubkey,
}) => {
  const { data } = await axios.get<LoansHistory[]>(
    `https://${BACKEND_DOMAIN}/loan/history/${walletPubkey?.toBase58()}`,
  );

  return data ?? [];
  // .map((loan) => ({
  //   ...loan,
  //   loanValue:
  //     loan.loanType === LoanType.BOND
  //       ? patchBorrowValueWithProtocolFee(loan.loanValue)
  //       : loan.loanValue,
  // }));
};
