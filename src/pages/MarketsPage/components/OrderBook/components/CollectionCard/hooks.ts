import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';

import { useMarketPairs } from '@frakt/utils/bonds';
import { PATHS } from '@frakt/constants';

import { SortOrder } from '../../types';
import {
  filterOffersByDuration,
  getOnlyOwnerOffers,
  parseMarketOrder,
  sortOffers,
} from '../../helpers';

export const useCollectionCard = ({
  marketPubkey,
  showOwnOrders,
  duration,
}) => {
  const { publicKey } = useWallet();
  const history = useHistory();

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

  const ownerOffers = getOnlyOwnerOffers(parsedOffers, publicKey);
  const sortedOffers = sortOffers(parsedOffers, sortDirection);
  const fitleredOffersByDuration = filterOffersByDuration(
    sortedOffers,
    duration,
  );

  const goToEditOffer = (orderPubkey: string) =>
    history.push(`${PATHS.OFFER}/${marketPubkey}/${orderPubkey}`);

  const offers = showOwnOrders ? ownerOffers : fitleredOffersByDuration;

  return {
    offers,
    toggleSortDirection,
    loading: isLoadingPairs,
    isVisibleOfferList,
    setIsVisibleOfferList,
    sortDirection,
    goToEditOffer,
  };
};
