import create from 'zustand';
import produce from 'immer';

import { Pair } from '@frakt/api/bonds';
import { BorrowNft } from '@frakt/api/nft';
import { LoanType } from '@frakt/api/loans';
import { BondOrder } from './types';

interface CurrentNftState {
  nft: BorrowNft;
  setNft: (nft: BorrowNft) => void;
  pair: Pair | null;
  bondOrder: BondOrder | null;
  setPair: (pair: Pair) => void;
  setBondOrder: (bondOrder: BondOrder) => void;
  loanType: LoanType | null;
  setLoanType: (loanType: LoanType) => void;
  loanValue: number;
  setLoanValue: (loanValue: number) => void;
  clearState: () => void;
  setState: (props: {
    nft: BorrowNft;
    pair: Pair | null;
    bondOrder: BondOrder | null;
    loanType: LoanType;
    loanValue: number;
  }) => void;
}

export const useCurrentNft = create<CurrentNftState>((set) => ({
  nft: null,
  setNft: (nft) =>
    set(
      produce((state: CurrentNftState) => {
        state.nft = nft;
      }),
    ),
  pair: null,
  setPair: (pair) =>
    set(
      produce((state: CurrentNftState) => {
        state.pair = pair;
      }),
    ),
  bondOrder: null,
  setBondOrder: (bondOrder) =>
    set(
      produce((state: CurrentNftState) => {
        state.bondOrder = bondOrder;
      }),
    ),
  loanType: null,
  setLoanType: (loanType) =>
    set(
      produce((state: CurrentNftState) => {
        state.loanType = loanType;
      }),
    ),
  loanValue: 0,
  setLoanValue: (loanValue) =>
    set(
      produce((state: CurrentNftState) => {
        state.loanValue = loanValue;
      }),
    ),
  setState: ({ nft, pair, loanType, loanValue, bondOrder }) =>
    set(
      produce((state: CurrentNftState) => {
        state.nft = nft;
        state.pair = pair;
        (state.bondOrder = bondOrder), (state.loanType = loanType);
        state.loanValue = loanValue;
      }),
    ),
  clearState: () =>
    set(
      produce((state: CurrentNftState) => {
        state.nft = null;
        state.pair = null;
        state.loanType = null;
        state.loanValue = 0;
        state.bondOrder = null;
      }),
    ),
}));
