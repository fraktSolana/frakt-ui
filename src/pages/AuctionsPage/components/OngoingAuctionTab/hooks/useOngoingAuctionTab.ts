import {
  useFetchAuctionsList,
  useFetchRefinanceAuctions,
} from './useFetchAuctions';

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

  const allAuctions = [...auctionsList, ...refinanceAuctions];

  return {
    isLoading,
    showList,
    showEmptyList,
    hideAuction,
    allAuctions,
  };
};
