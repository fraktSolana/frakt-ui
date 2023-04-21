import create from 'zustand';
import produce from 'immer';

import { BorrowNft } from '@frakt/api/nft';
import { LoanType } from '@frakt/api/loans';

import { BondOrderParams } from './types';

interface CurrentNftState {
  nft: BorrowNft;
  setNft: (nft: BorrowNft) => void;
  bondOrderParams: BondOrderParams | null;
  setBondOrderParams: (bondOrderParams: BondOrderParams) => void;
  loanType: LoanType | null;
  setLoanType: (loanType: LoanType) => void;
  loanValue: number;
  setLoanValue: (loanValue: number) => void;
  clearState: () => void;
  setState: (props: {
    nft: BorrowNft;
    bondOrderParams: BondOrderParams | null;
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
  bondOrderParams: null,
  setBondOrderParams: (bondOrderParams) =>
    set(
      produce((state: CurrentNftState) => {
        state.bondOrderParams = bondOrderParams;
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
  setState: ({ nft, loanType, loanValue, bondOrderParams }) =>
    set(
      produce((state: CurrentNftState) => {
        state.nft = nft;
        state.bondOrderParams = bondOrderParams;
        state.loanType = loanType;
        state.loanValue = loanValue;
      }),
    ),
  clearState: () =>
    set(
      produce((state: CurrentNftState) => {
        state.nft = null;
        state.loanType = null;
        state.loanValue = 0;
        state.bondOrderParams = null;
      }),
    ),
}));
