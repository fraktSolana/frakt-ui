import { create } from 'zustand';
import { Dictionary } from 'lodash';
import produce from 'immer';

import { BorrowNft, OrderParamsLite } from '@frakt/api/nft';
import { LoanType } from '@frakt/api/loans';

interface CartStateLite {
  nfts: BorrowNft[];
  orderParamsByMint: Dictionary<OrderParamsLite>; //? Collection by mint
  addNft: (props: {
    nft: BorrowNft;
    orderParams?: OrderParamsLite;
    loanType: LoanType;
  }) => void;
  removeNft: (props: { nftMint: string; loanType: LoanType }) => void;
  findNftInCart: (props: { nftMint: string }) => BorrowNft | null;
  getNftsCountByMarket: (props: { marketPubkey: string }) => number;
  clearCart: () => void;
}

export const useCartStateLite = create<CartStateLite>((set, get) => ({
  nfts: [],
  orderParamsByMint: {},
  findNftInCart: ({ nftMint }) => {
    return get().nfts.find(({ mint }) => mint === nftMint) ?? null;
  },
  getNftsCountByMarket: ({ marketPubkey }) => {
    return (
      get().nfts.filter(
        ({ bondParams }) => bondParams?.marketPubkey === marketPubkey,
      )?.length || 0
    );
  },
  addNft: ({ nft, orderParams, loanType }) => {
    if (get().findNftInCart({ nftMint: nft.mint })) return;

    set(
      produce((state: CartStateLite) => {
        state.nfts = [...state.nfts, nft];
        if (loanType === LoanType.BOND) {
          state.orderParamsByMint = {
            ...state.orderParamsByMint,
            [nft.mint]: orderParams,
          };
        }
      }),
    );
  },
  removeNft: ({ nftMint, loanType }) => {
    set(
      produce((state: CartStateLite) => {
        const nftToRemove = state.findNftInCart({ nftMint });

        if (!nftToRemove) return;

        state.nfts = state.nfts.filter(({ mint }) => mint !== nftMint);

        if (loanType === LoanType.BOND) {
          const removableOrderParam = state.orderParamsByMint[nftMint];

          const firstLowerLoanValueNft =
            state.nfts.find(({ mint }) => {
              const loanValue = state.orderParamsByMint[mint].loanValue;
              return loanValue < removableOrderParam.loanValue;
            }) ?? null;

          if (firstLowerLoanValueNft) {
            state.orderParamsByMint[firstLowerLoanValueNft.mint] =
              removableOrderParam;
          }

          delete state.orderParamsByMint[nftMint];
        }
      }),
    );
  },
  clearCart: () =>
    set(
      produce((state: CartStateLite) => {
        state.nfts = [];
        state.orderParamsByMint = {};
      }),
    ),
}));
