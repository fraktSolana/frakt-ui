import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import produce from 'immer';

import { fetchRefinanceAuctions } from '@frakt/api/auctions';

export const useFetchRefinanceAuctions = () => {
  const { hiddenAuctionsPubkeys, hideAuction } = useHiddenAuctionPubkeys();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: any[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(['fetchRefinanceAuctions'], () => fetchRefinanceAuctions(), {
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  return {
    data:
      data?.filter(({ nftMint }) => !hiddenAuctionsPubkeys.includes(nftMint)) ||
      [],
    loading: isLoading || isFetching,
    hideAuction,
  };
};

interface HiddenAuctionsPubkeysState {
  hiddenAuctionsPubkeys: string[];
  hideAuction: (nftMint: string) => void;
}
const useHiddenAuctionPubkeys = create<HiddenAuctionsPubkeysState>((set) => ({
  hiddenAuctionsPubkeys: [],
  hideAuction: (nftMint) =>
    set(
      produce((state: HiddenAuctionsPubkeysState) => {
        state.hiddenAuctionsPubkeys = [...state.hiddenAuctionsPubkeys, nftMint];
      }),
    ),
}));
