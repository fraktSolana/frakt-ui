import { web3 } from '@frakt-protocol/frakt-sdk';
import { IS_PRIVATE_MARKETS } from '@frakt/config';
import axios from 'axios';

import { BorrowNft, BulkSuggestion, MaxBorrow, Suggestion } from './types';
import { patchBorrowValueWithProtocolFee } from '@frakt/pages/BorrowPages/cartState';

const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN;

type FetchWalletBorrowNfts = (props: {
  publicKey: web3.PublicKey;
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: 'name' | 'maxLoanValue';
  sortOrder?: 'desc' | 'asc';
  duration?: '7' | '14' | '0' | null;
}) => Promise<BorrowNft[]>;

export const fetchWalletBorrowNfts: FetchWalletBorrowNfts = async ({
  publicKey,
  limit = 1000,
  offset = 0,
  search = '',
  sortBy = 'name',
  sortOrder = 'desc',
  duration = null,
}) => {
  const searchQuery = search ? `search=${search}&` : '';
  const durationQuery = duration ? `duration=${duration}&` : '';

  const { data } = await axios.get<BorrowNft[]>(
    `https://${BACKEND_DOMAIN}/nft/meta2/${publicKey?.toBase58()}?${durationQuery}${searchQuery}limit=${limit}&skip=${offset}&sortBy=${sortBy}&sort=${sortOrder}&isPrivate=${IS_PRIVATE_MARKETS}`,
  );

  return data.map((nft) => ({
    ...nft,
    maxLoanValue:
      nft.maxLoanValue > nft.classicParams.maxLoanValue
        ? patchBorrowValueWithProtocolFee(nft.maxLoanValue)
        : nft.maxLoanValue,
  }));
};

type FetchBulkSuggestion = (props: {
  publicKey: web3.PublicKey;
  totalValue: string | number;
}) => Promise<BulkSuggestion | null>;

export const fetchBulkSuggestion: FetchBulkSuggestion = async ({
  publicKey,
  totalValue,
}) => {
  const { data } = await axios.get<BulkSuggestion>(
    `https://${BACKEND_DOMAIN}/nft/suggest/${publicKey?.toBase58()}?solAmount=${totalValue}&isPrivate=${IS_PRIVATE_MARKETS}`,
  );

  return data ?? null;
};

type FetchBulkSuggestionMinimized = (props: {
  publicKey: web3.PublicKey;
  totalValue: string | number;
  duration?: '7' | '14' | '0';
}) => Promise<Suggestion | null>;

export const fetchBulkSuggestionMinimized: FetchBulkSuggestionMinimized =
  async ({ publicKey, totalValue, duration = 7 }) => {
    const { data } = await axios.get<{ best: Suggestion }>(
      `https://${BACKEND_DOMAIN}/nft/suggest-minimized/${publicKey?.toBase58()}?solAmount=${totalValue}&duration=${duration}&isPrivate=${IS_PRIVATE_MARKETS}`,
    );

    return data?.best ?? null;
  };

type FetchMaxBorrowValue = (props: {
  publicKey: web3.PublicKey;
}) => Promise<number>;

export const fetchMaxBorrowValue: FetchMaxBorrowValue = async ({
  publicKey,
}) => {
  const { data } = await axios.get<{ maxBorrow: number }>(
    `https://${BACKEND_DOMAIN}/nft/max-borrow/${publicKey?.toBase58()}?isPrivate=${IS_PRIVATE_MARKETS}`,
  );

  return data?.maxBorrow ?? 0;
};

type FetchMaxBorrowValuePro = (props: {
  publicKey: web3.PublicKey;
}) => Promise<MaxBorrow>;

export const fetchMaxBorrowValuePro: FetchMaxBorrowValuePro = async ({
  publicKey,
}) => {
  const { data } = await axios.get<MaxBorrow>(
    `https://${BACKEND_DOMAIN}/nft/max-borrow-pro/${publicKey?.toBase58()}?isPrivate=${IS_PRIVATE_MARKETS}`,
  );

  return (
    data ?? {
      '0': 0,
      '7': 0,
      '14': 0,
      all: 0,
    }
  );
};

type GetNftMerkleTreeProof = (props: {
  mint: web3.PublicKey;
}) => Promise<Buffer[] | null>;
export const getNftMerkleTreeProof: GetNftMerkleTreeProof = async ({
  mint,
}) => {
  const { data } = await axios.get<{ proof: Buffer[] | null }>(
    `https://${BACKEND_DOMAIN}/nft/proof/${mint?.toBase58()}`,
  );

  return data.proof || null;
};
