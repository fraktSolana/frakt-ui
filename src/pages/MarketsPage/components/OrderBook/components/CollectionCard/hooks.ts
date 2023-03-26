import { useState } from 'react';
import { useMarketPairs } from '@frakt/utils/bonds';

import { getOnlyOwnerOffers, sortOffers } from './helpers';
import { parseMarketOrder } from '../../helpers';
import { SortOrder } from '../../types';

export const useCollectionCard = ({ marketPubkey, showOwnOrders }) => {
  const [isVisibleOfferList, setIsVisibleOfferList] = useState<boolean>(false);
  const { pairs, isLoading: isLoadingPairs } = useMarketPairs({
    marketPubkey: isVisibleOfferList ? marketPubkey : '',
  });
  const [sortDirection, setSortDirection] = useState<SortOrder>(SortOrder.DESC);

  const parsedOffers = pairs.map(parseMarketOrder, sortDirection);

  const toggleSortDirection = () => {
    sortDirection === SortOrder.DESC
      ? setSortDirection(SortOrder.ASC)
      : setSortDirection(SortOrder.DESC);
  };

  const ownerOffers = getOnlyOwnerOffers(parsedOffers);
  const sortedOffers = sortOffers(parsedOffers, sortDirection);

  const offers = showOwnOrders ? ownerOffers : sortedOffers;

  return {
    offers,
    toggleSortDirection,
    loading: isLoadingPairs,
    isVisibleOfferList,
    setIsVisibleOfferList,
    sortDirection,
  };
};
