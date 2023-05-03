import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';

import { useMarketPairs } from '@frakt/utils/bonds';
import { PATHS } from '@frakt/constants';

import { MarketOrder } from '../../types';
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

  const parsedOffers = pairs.map(parseMarketOrder);

  const isOwnOrder = (order: MarketOrder): boolean => {
    return order?.rawData?.assetReceiver === publicKey?.toBase58();
  };

  const sortedOffers = sortOffers(parsedOffers, 'desc');
  const fitleredOffersByDuration = filterOffersByDuration(
    sortedOffers,
    duration,
  );

  const offers = (
    showOwnOrders
      ? fitleredOffersByDuration.filter(isOwnOrder)
      : fitleredOffersByDuration
  ).filter((offer) => isOwnOrder(offer) || offer.size > 0);

  const goToEditOffer = (orderPubkey: string) =>
    history.push(`${PATHS.OFFER}/${marketPubkey}/${orderPubkey}`);

  const bestOffer = fitleredOffersByDuration?.at(0);

  return {
    offers,
    loading: isLoadingPairs,
    isVisibleOfferList,
    setIsVisibleOfferList,
    goToEditOffer,
    isOwnOrder,
    bestOffer,
  };
};
