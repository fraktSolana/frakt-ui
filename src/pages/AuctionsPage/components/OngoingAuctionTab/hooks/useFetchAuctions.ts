import { useMemo } from 'react';
import { BanxStakeState } from 'fbonds-core/lib/fbond-protocol/types';
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import produce from 'immer';

import { AuctionItem, fetchAllAuctions } from '@frakt/api/auctions';

import { parseRefinanceAuctionsInfo } from '../../RefinanceAuctionCard';

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

  const filteredStakedNFTs = useMemo(() => {
    return filteredAuctions.filter(
      (auction: AuctionItem) =>
        auction?.banxStake?.banxStakeState !== BanxStakeState.Staked,
    );
  }, [filteredAuctions]);

  const filteredValidAuctions = useMemo(() => {
    return filteredStakedNFTs.filter((auction: AuctionItem) => {
      if (auction?.bondParams?.auctionRefinanceStartTime) {
        const { floorPrice, currentLoanAmount } =
          parseRefinanceAuctionsInfo(auction);

        return parseFloat(currentLoanAmount) < parseFloat(floorPrice);
      }
      return auction;
    });
  }, [filteredStakedNFTs]);

  return {
    data: filteredValidAuctions,
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
