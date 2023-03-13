import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { parseMarketOrder } from './helpers';
import { MarketOrder } from './types';
import { useMarketPairs } from '@frakt/utils/bonds';
import { compareNumbers } from '@frakt/utils';
import { useParams } from 'react-router-dom';

type UseMarketOrders = (props: {
  marketPubkey: web3.PublicKey;
  sortDirection?: 'desc' | 'asc'; //? Sort by interest only
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
};

export const useMarketOrders: UseMarketOrders = ({
  marketPubkey,
  sortDirection = 'desc',
  walletOwned = false,
  ltv,
  size,
  interest,
  duration,
}) => {
  const { publicKey } = useWallet();

  const { pairPubkey: pairPubkey } = useParams<{ pairPubkey: string }>();

  const { pairs, isLoading, hidePair } = useMarketPairs({
    marketPubkey: marketPubkey?.toBase58(),
  });

  const offers = useMemo(() => {
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

    const parsedOffers = pairs
      .filter((pair) => {
        return !walletOwned || pair?.assetReceiver === publicKey?.toBase58();
      })
      .map(parseMarketOrder);

    const parsedEditabledOffers = [];

    if (editOfferPubkey) {
      const offers = parsedOffers.map((offer) => {
        const isEditOffer = offer?.rawData?.publicKey === editOfferPubkey;
        if (isEditOffer) return { ...offer, ...myOffer };
        return offer;
      });

      parsedEditabledOffers.push(...offers);
    }

    if (ltv && !editOffer?.publicKey) {
      parsedOffers.push(myOffer);
    }

    const offers = editOfferPubkey ? parsedEditabledOffers : parsedOffers;

    const sortOffersByInterest = offers.sort((a, b) => {
      return compareNumbers(a.interest, b.interest, sortDirection === 'desc');
    });

    const sortedByLtv = (
      sortDirection === 'asc'
        ? sortOffersByInterest
        : sortOffersByInterest.reverse()
    ).sort((a, b) => compareNumbers(a.ltv, b.ltv, sortDirection === 'desc'));

    return sortedByLtv;
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

  const offersExist = Boolean(offers.length);

  return {
    offersExist,
    offers,
    isLoading,
    hidePair,
  };
};
