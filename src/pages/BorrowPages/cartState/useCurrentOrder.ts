import create from 'zustand';
import produce from 'immer';

// import { Pair } from '@frakt/api/bonds';
// import { BorrowNft } from '@frakt/api/nft';
import { LoanType } from '@frakt/api/loans';
import { BondOrderParams, CartOrder } from './types';

interface CurrentOrderState {
  order: CartOrder | null;
  set: (order: CartOrder) => void;
  changeLoanType: (loanType: LoanType) => void;
  changeLoanValue: (loanValue: number) => void;
  changeBondParams: (params?: BondOrderParams | null) => void;
  reset: () => void;
}

export const useCurrentOrder = create<CurrentOrderState>((set) => ({
  order: null,
  set: (order) =>
    set(
      produce<CurrentOrderState>((state) => {
        state.order = order;
      }),
    ),
  changeLoanType: (loanType) =>
    set(
      produce<CurrentOrderState>((state) => {
        if (!state.order) return;
        state.order = { ...state.order, loanType };
      }),
    ),
  changeLoanValue: (loanValue) =>
    set(
      produce<CurrentOrderState>((state) => {
        if (!state.order) return;
        state.order = { ...state.order, loanValue };
      }),
    ),
  changeBondParams: (params = null) =>
    set(
      produce<CurrentOrderState>((state) => {
        if (!state.order) return;
        state.order = { ...state.order, bondOrderParams: params };
      }),
    ),
  reset: () =>
    set(
      produce<CurrentOrderState>((state) => {
        state.order = null;
      }),
    ),
}));
