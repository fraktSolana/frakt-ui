import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import produce from 'immer';

import {
  AuctionListItem,
  BondsAuctionsListItem,
  fetchAuctionsBondsList,
  fetchAuctionsList,
} from '@frakt/api/raffle';

export const useFetchAuctionsList = () => {
  const { hiddenAuctionsPubkeys, hideAuction } = useHiddenAuctionPubkeys();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: AuctionListItem[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(['fetchAuctionsList'], () => fetchAuctionsList(), {
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  return {
    data:
      data?.filter(
        ({ auctionPubkey }) => !hiddenAuctionsPubkeys.includes(auctionPubkey),
      ) || [],
    loading: isLoading || isFetching,
    hideAuction,
  };
};

export const useFetchBondsAuctionsList = () => {
  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: BondsAuctionsListItem[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(['fetchBondsAuctionsList'], () => fetchAuctionsBondsList(), {
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  return {
    data: data || [],
    loading: isLoading || isFetching,
  };
};

interface HiddenAuctionsPubkeysState {
  hiddenAuctionsPubkeys: string[];
  hideAuction: (bondPubkey: string) => void;
}
const useHiddenAuctionPubkeys = create<HiddenAuctionsPubkeysState>((set) => ({
  hiddenAuctionsPubkeys: [],
  hideAuction: (bondPubkey) =>
    set(
      produce((state: HiddenAuctionsPubkeysState) => {
        state.hiddenAuctionsPubkeys = [
          ...state.hiddenAuctionsPubkeys,
          bondPubkey,
        ];
      }),
    ),
}));
