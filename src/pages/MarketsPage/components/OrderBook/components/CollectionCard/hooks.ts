import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';

import { useMarketPairs } from '@frakt/utils/bonds';
import { PATHS } from '@frakt/constants';

import { MarketOrder, SortOrder } from '../../types';
import {
  filterOffersByDuration,
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

  const isOwnOrder = (order: MarketOrder): boolean => {
    return order?.rawData?.assetReceiver === publicKey?.toBase58();
  };

  const sortedOffers = sortOffers(parsedOffers, sortDirection);
  const fitleredOffersByDuration = filterOffersByDuration(
    sortedOffers,
    duration,
  );

  const offers = showOwnOrders
    ? fitleredOffersByDuration.filter(isOwnOrder)
    : fitleredOffersByDuration;

  const goToEditOffer = (orderPubkey: string) =>
    history.push(`${PATHS.OFFER}/${marketPubkey}/${orderPubkey}`);

  const bestOffer = fitleredOffersByDuration?.at(0);

  return {
    offers,
    toggleSortDirection,
    loading: isLoadingPairs,
    isVisibleOfferList,
    setIsVisibleOfferList,
    sortDirection,
    goToEditOffer,
    isOwnOrder,
    bestOffer,
  };
};
