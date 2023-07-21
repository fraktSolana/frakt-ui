import { useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { orderBy } from 'lodash';

import { useMarketOrders } from '@frakt/pages/MarketsPage/components/OrderBook/hooks';
import { useMarket } from '@frakt/utils/bonds';

import { calculateLoanValue } from '../PlaceOfferTab';
import { MarketOrder, UseOrderBookLite } from './types';
import {
  groupOffers,
  getNormalizedLoanValue,
  getNormalizedLoanAmount,
} from './helpers';

const MIN_SIZE_FOR_VIEW = 0.001;
const SYNTHETIC_INTEREST = 0;
const SYNTHETIC_LTV = 100;

export const useOrderBookLite: UseOrderBookLite = ({
  pairPubkey,
  marketPubkey,
  syntheticParams,
  setPairPubkey,
}) => {
  const wallet = useWallet();
  const { market } = useMarket({ marketPubkey });

  const marketFloor = market?.oracleFloor?.floor || 0;

  const isOwnOrder = (order: MarketOrder): boolean => {
    return order?.rawData?.assetReceiver === wallet?.publicKey?.toBase58();
  };

  const orderBookParams = useMemo(() => {
    return {
      marketPubkey: marketPubkey && new web3.PublicKey(marketPubkey),
      ltv: SYNTHETIC_LTV,
      interest: SYNTHETIC_INTEREST,
      size: syntheticParams?.offerSize,
      loanValue: syntheticParams?.loanValue,
      loanAmount: syntheticParams?.loanAmount,
      pairPubkey,
    };
  }, [marketPubkey, syntheticParams]);

  const { offers: offersRaw, isLoading } = useMarketOrders(orderBookParams);

  const offers: MarketOrder[] = useMemo(() => {
    return groupOffers(offersRaw as MarketOrder[], isOwnOrder).filter(
      (offer) => offer?.size > MIN_SIZE_FOR_VIEW || isOwnOrder(offer),
    );
  }, [offersRaw, isOwnOrder]);

  const sortedOffers = useMemo(() => {
    if (marketFloor) {
      return orderBy(
        offers,
        (offer) => {
          const { synthetic, loanValue } = offer || {};
          return synthetic
            ? loanValue
            : calculateLoanValue(offer, marketFloor) / 1e9;
        },
        'desc',
      );
    }
    return offers;
  }, [marketFloor, offers]);

  const bestOffer = useMemo(() => {
    const validOffers = sortedOffers.map((offer) => {
      if (offer?.synthetic) return null;

      const loanValue = getNormalizedLoanValue(offer, marketFloor);
      const loanAmount = getNormalizedLoanAmount(offer, loanValue);

      return { ...offer, loanAmount };
    });

    const bestOffer = validOffers.find((offer) => offer?.loanAmount >= 1);

    return bestOffer;
  }, [sortedOffers]);

  const [openOffersMobile, setOpenOffersMobile] = useState<boolean>(true);

  const toggleOffers = () => {
    setOpenOffersMobile((prev) => !prev);
  };

  const goToEditOffer = (orderPubkey: string) => {
    setPairPubkey(orderPubkey);
  };

  const offersExist = Boolean(offers.length);
  const isSelectedOffers = !!syntheticParams?.loanValue;
  const showOrderBook = !isLoading && offersExist;
  const showNoActiveOffers = !isLoading && !offersExist && !isSelectedOffers;
  const showLoader = isLoading && !offersExist;

  return {
    showNoActiveOffers,
    showOrderBook,
    showLoader,
    offersExist,

    openOffersMobile,
    toggleOffers,

    isSelectedOffers,

    orderBookParams: {
      offers: sortedOffers,
      bestOffer: bestOffer as MarketOrder,
      goToEditOffer,
      isOwnOrder,
      marketFloor,
    },
  };
};
