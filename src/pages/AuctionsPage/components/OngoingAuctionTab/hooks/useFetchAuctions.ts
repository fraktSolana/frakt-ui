import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import produce from 'immer';

import { AuctionItem, fetchAllAuctions } from '@frakt/api/auctions';

export const useFetchAuctionsList = () => {
  const { hiddenAuctionsPubkeys, hideAuction } = useHiddenAuctionPubkeys();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: AuctionItem[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(['fetchAuctionsList'], () => fetchAllAuctions(), {
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  const filteredAuctions =
    data?.filter(({ nftMint }) => !hiddenAuctionsPubkeys.includes(nftMint)) ||
    [];

  return {
    data: filteredAuctions,
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
