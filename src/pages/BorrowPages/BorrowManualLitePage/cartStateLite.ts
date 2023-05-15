import { create } from 'zustand';
import { Dictionary } from 'lodash';
import produce from 'immer';

import { BorrowNft, OrderParamsLite } from '@frakt/api/nft';
import { LoanType } from '@frakt/api/loans';

interface CartStateLite {
  nfts: BorrowNft[];
  orderParamsByMint: Dictionary<OrderParamsLite>; //? Collection by mint
  currentNft: BorrowNft | null;
  addNft: (props: {
    nft: BorrowNft;
    orderParams?: OrderParamsLite;
    loanType: LoanType;
  }) => void;

  removeNft: (props: { nftMint: string; loanType: LoanType }) => void;
  findNftInCart: (props: { nftMint: string }) => BorrowNft | null;
  getNftsCountByMarket: (props: { marketPubkey: string }) => number;
  selectNextCurrentNft: (reverse?: boolean) => void;
  clearCart: () => void;
}

export const useCartStateLite = create<CartStateLite>((set, get) => ({
  nfts: [],
  orderParamsByMint: {},
  currentNft: null,
  selectNextCurrentNft: (reverse = false) => {
    set(
      produce((state: CartStateLite) => {
        const { currentNft, nfts } = state;

        if (!currentNft || nfts.length === 1) return;

        const currentNftIdx = nfts.findIndex(
          ({ mint }) => currentNft.mint === mint,
        );

        const isCurrentFirst = currentNftIdx === 0;
        const isCurrentLast = currentNftIdx === nfts.length - 1;

        if (!reverse) {
          if (isCurrentLast) {
            state.currentNft = nfts.at(0);
          } else {
            state.currentNft = nfts.at(currentNftIdx + 1);
          }
        } else {
          if (isCurrentFirst) {
            state.currentNft = nfts.at(-1);
          } else {
            state.currentNft = nfts.at(currentNftIdx - 1);
          }
        }
      }),
    );
  },
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

        state.currentNft = nft;
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

        const nftToRemoveIdx = state.nfts.findIndex(
          ({ mint }) => mint === nftMint,
        );

        //? If removableNft is current. Set prev or clear current state
        if (nftToRemove.mint === state.currentNft?.mint) {
          if (nftToRemoveIdx === 0) {
            state.currentNft = null;
          } else {
            const currentNftIdx = state.nfts.findIndex(
              ({ mint }) => state.currentNft.mint === mint,
            );
            const isCurrentFirst = currentNftIdx === 0;

            if (isCurrentFirst) {
              state.currentNft = state.nfts.at(state.nfts.length - 1);
            } else {
              state.currentNft = state.nfts.at(-2);
            }
          }
        }

        state.nfts = state.nfts.filter(({ mint }) => mint !== nftMint);

        if (loanType === LoanType.BOND) {
          const removableOrderParam = state.orderParamsByMint[nftMint];

          const firstLowerLoanValueNftSameCollection =
            state.nfts.find(({ mint, bondParams }) => {
              const loanValue = state.orderParamsByMint[mint].loanValue;
              const sameCollection =
                bondParams?.marketPubkey ===
                nftToRemove.bondParams?.marketPubkey;
              return (
                loanValue < removableOrderParam.loanValue && sameCollection
              );
            }) ?? null;

          if (firstLowerLoanValueNftSameCollection) {
            state.orderParamsByMint[firstLowerLoanValueNftSameCollection.mint] =
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
        state.currentNft = null;
      }),
    ),
}));
