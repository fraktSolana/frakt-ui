import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';
import { web3 } from 'fbonds-core';

import { useMarketPairs } from '@frakt/utils/bonds';

import { MarketOrder } from './types';
import {
  filterOffersByDuration,
  parseMarketOrder,
  sortOffersByInterest,
  sortOffersByLtv,
} from './helpers';

type UseMarketOrders = (props: {
  marketPubkey: web3.PublicKey;
  sortDirection?: 'desc' | 'asc'; //? Sort by interest only
  filterDuration?: number;
  walletOwned?: boolean;
  ltv: number;
  size: number; //? lamports
  interest: number;
  duration: number;
}) => {
  offers: MarketOrder[];
  isLoading: boolean;
  offersExist: boolean;
  hidePair: (pairPubkey: string) => void;
  bestOffer: MarketOrder;
};

export const useMarketOrders: UseMarketOrders = ({
  marketPubkey,
  sortDirection = 'desc',
  walletOwned,
  ltv,
  size,
  interest,
  duration,
  filterDuration,
}) => {
  const { publicKey } = useWallet();

  const { pairPubkey: pairPubkey } = useParams<{ pairPubkey: string }>();

  const { pairs, isLoading, hidePair } = useMarketPairs({
    marketPubkey: marketPubkey?.toBase58(),
  });

  const [allOffers, ownerOffers] = useMemo(() => {
    if (!pairs) return [];

    const editOffer = pairs.find(({ publicKey }) => publicKey === pairPubkey);
    const editOfferPubkey = editOffer?.publicKey;

    const myOffer: MarketOrder = {
      ltv,
      size: size / 1e9,
      interest: interest / 1e2,
      duration: duration ?? 7,
      synthetic: true,
      rawData: {
        publicKey: '',
        assetReceiver: '',
        edgeSettlement: 0,
        authorityAdapter: '',
      },
    };

    const parsedOffers = pairs.map(parseMarketOrder);

    const parsedEditabledOffers = [];

    if (editOfferPubkey) {
      const offers = parsedOffers.map((offer) => {
        const isEditOffer = offer?.rawData?.publicKey === editOfferPubkey;
        if (isEditOffer) return { ...myOffer, ...offer };
        return offer;
      });

      parsedEditabledOffers.push(...offers);
    }

    if (ltv && !editOffer?.publicKey) {
      parsedOffers.push(myOffer);
    }

    const offers = editOfferPubkey ? parsedEditabledOffers : parsedOffers;

    const sortedOffersByInterest = sortOffersByInterest(offers, sortDirection);
    const sortedByLtv = sortOffersByLtv(sortedOffersByInterest, sortDirection);
    const sortedByDuration = filterOffersByDuration(
      sortedByLtv,
      filterDuration,
    );

    const ownerOffers = sortedByDuration.filter(
      (pair) =>
        !walletOwned || pair.rawData?.assetReceiver === publicKey?.toBase58(),
    );

    return [sortedByDuration, ownerOffers];
  }, [
    pairs,
    sortDirection,
    walletOwned,
    publicKey,
    ltv,
    size,
    interest,
    duration,
  ]);

  const offersExist = Boolean(allOffers.length);

  const bestOffer = useMemo(() => {
    return allOffers.at(0)?.synthetic ? allOffers.at(1) : allOffers.at(0);
  }, [allOffers]);

  return {
    offersExist,
    offers: walletOwned ? ownerOffers : allOffers,
    isLoading,
    hidePair,
    bestOffer,
  };
};