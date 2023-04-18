import axios from 'axios';
import { web3 } from 'fbonds-core';

import { FetchLoansHistoryParams, Loan, LoansHistory } from './types';

const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN;

type FetchWalletLoans = (props: {
  publicKey: web3.PublicKey;
}) => Promise<Loan[]>;

export const fetchWalletLoans: FetchWalletLoans = async ({ publicKey }) => {
  const { data } = await axios.get<Loan[]>(
    `https://${BACKEND_DOMAIN}/loan/all/${publicKey?.toBase58()}`,
  );

  return data ?? [];
};

type FetchLoansHistory = (
  props: FetchLoansHistoryParams,
) => Promise<LoansHistory[]>;

export const fetchLoansHistory: FetchLoansHistory = async ({
  walletPubkey,
  skip,
  limit = 10,
  sortBy = 'date',
  direction = 'desc',
  querySearch = '',
}) => {
  const { data } = await axios.get<LoansHistory[]>(
    `https://${BACKEND_DOMAIN}/history/loans/${walletPubkey?.toBase58()}?sort=${direction}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&search=${querySearch}`,
  );

  return data ?? [];
};
