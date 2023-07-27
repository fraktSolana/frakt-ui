import { useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { orderBy } from 'lodash';

import { useMarket } from '@frakt/utils/bonds';

import { useLiteMarketOrders } from './useLiteMarketOrders';
import { calculateLoanValue } from '../../PlaceOfferTab';
import { UseOrderBookLite, MarketOrder } from '../types';
import { getBestOffer, groupOffers } from '../helpers';

const MIN_SIZE_FOR_VIEW = 0.001;

export const useOrderBookLite: UseOrderBookLite = ({
  pairPubkey,
  marketPubkey,
  syntheticParams,
  setPairPubkey,
}) => {
  const wallet = useWallet();
  const { market, isLoading: isLoadingMarket } = useMarket({ marketPubkey });

  const marketFloor = market?.oracleFloor?.floor || 0;

  const isOwnOrder = (order: MarketOrder): boolean => {
    return order?.rawData?.assetReceiver === wallet?.publicKey?.toBase58();
  };

  const orderBookParams = useMemo(() => {
    if (marketPubkey) {
      return {
        marketPubkey,
        size: syntheticParams?.offerSize,
        loanValue: syntheticParams?.loanValue,
        loanAmount: syntheticParams?.loanAmount,
        pairPubkey,
      };
    }
  }, [marketPubkey, syntheticParams]);

  const { offers, isLoading } = useLiteMarketOrders(orderBookParams);

  const filteredPositiveOffers: MarketOrder[] = useMemo(() => {
    return groupOffers(offers as MarketOrder[], isOwnOrder).filter(
      (offer) => offer?.size > MIN_SIZE_FOR_VIEW || isOwnOrder(offer),
    );
  }, [offers, isOwnOrder]);

  const sortedOffers = useMemo(() => {
    if (marketFloor) {
      return orderBy(
        filteredPositiveOffers,
        (offer) => {
          const { synthetic, loanValue } = offer || {};
          const calculatedLoanValue =
            calculateLoanValue(offer, marketFloor) / 1e9;

          return synthetic ? loanValue : calculatedLoanValue;
        },
        'desc',
      );
    }
    return filteredPositiveOffers;
  }, [marketFloor, filteredPositiveOffers]);

  const bestOffer = getBestOffer(sortedOffers as MarketOrder[], marketFloor);

  const [openOffersMobile, setOpenOffersMobile] = useState<boolean>(true);

  const toggleOffers = () => {
    setOpenOffersMobile((prev) => !prev);
  };

  const goToEditOffer = (orderPubkey: string) => {
    setPairPubkey(orderPubkey);
  };

  const loading = isLoading || isLoadingMarket;

  const offersExist = Boolean(sortedOffers.length);
  const isSelectedOffers = !!syntheticParams?.loanValue;
  const showOrderBook = !loading && offersExist;
  const showNoActiveOffers = !loading && !offersExist && !isSelectedOffers;
  const showLoader = loading && !offersExist;

  return {
    showNoActiveOffers,
    showOrderBook,
    showLoader,
    offersExist,

    openOffersMobile,
    toggleOffers,

    isSelectedOffers,

    collectionImage: market?.collectionImage || '',
    collectionName: market?.collectionName || '',

    orderBookParams: {
      offers: sortedOffers,
      bestOffer,
      goToEditOffer,
      isOwnOrder,
      marketFloor,
    },
  };
};
