import { RefinanceAuctionItem } from '@frakt/api/auctions';
import {
  useFetchAuctionsList,
  useFetchRefinanceAuctions,
} from './useFetchAuctions';
import { parseRefinanceAuctionsInfo } from '../../RefinanceAuctionCard';

export const useOngoingAuctionTab = () => {
  const { data: refinanceAuctions, loading: isRefinanceAuctionsListLoading } =
    useFetchRefinanceAuctions();

  const {
    data: auctionsList,
    loading: isAuctionsListLoading,
    hideAuction,
  } = useFetchAuctionsList();

  const isLoading = isAuctionsListLoading || isRefinanceAuctionsListLoading;
  const hasAuctions = !!auctionsList?.length || !!refinanceAuctions?.length;
  const showList = hasAuctions && !isLoading;
  const showEmptyList = !showList && !isLoading;

  const filteredRefinanceAuctions = refinanceAuctions.filter(
    (auction: RefinanceAuctionItem) => {
      const { floorPrice, currentLoanAmount } =
        parseRefinanceAuctionsInfo(auction);

      return parseFloat(currentLoanAmount) < parseFloat(floorPrice);
    },
  );

  const allAuctions = [...auctionsList, ...filteredRefinanceAuctions];

  return {
    isLoading,
    showList,
    showEmptyList,
    hideAuction,
    allAuctions,
  };
};
