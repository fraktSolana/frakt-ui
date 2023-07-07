import { useFetchAuctionsList } from './useFetchAuctions';

export const useOngoingAuctionTab = () => {
  const {
    data: auctions,
    loading: isAuctionsListLoading,
    hideAuction,
  } = useFetchAuctionsList();

  const showList = !!auctions?.length && !isAuctionsListLoading;
  const showEmptyList = !showList && !isAuctionsListLoading;

  return {
    isLoading: isAuctionsListLoading,
    showList,
    showEmptyList,
    hideAuction,
    auctions,
  };
};
