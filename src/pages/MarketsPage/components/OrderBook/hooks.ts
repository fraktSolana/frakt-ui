import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';

import { useMarketPairs } from '@frakt/utils/bonds';

import { MarketOrder } from './types';
import {
  parseMarketOrder,
  sortOffersByInterest,
  sortOffersByLtv,
} from './helpers';

type UseMarketOrders = (props: {
  marketPubkey: web3.PublicKey;
  walletOwned?: boolean;
  ltv: number;
  size: number; //? lamports
  interest: number;
  loanValue?: number;
  loanAmount?: number;
  pairPubkey: string;
}) => {
  offers: MarketOrder[];
  isLoading: boolean;
  hidePair: (pairPubkey: string) => void;
  bestOffer: MarketOrder;
};

export const useMarketOrders: UseMarketOrders = ({
  marketPubkey,
  walletOwned,
  ltv,
  size,
  interest,
  loanValue,
  loanAmount,
  pairPubkey,
}) => {
  const { publicKey } = useWallet();

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
      duration: 7,
      loanValue,
      loanAmount,
      synthetic: true,
      rawData: {
        publicKey: '',
        assetReceiver: '',
        edgeSettlement: 0,
        authorityAdapter: '',
      },
    };

    const parsedOffers = pairs.map(parseMarketOrder);

    const parsedEditableOffers = editOfferPubkey
      ? parsedOffers.map((offer) =>
          offer?.rawData?.publicKey === editOfferPubkey
            ? { ...myOffer, ...offer }
            : offer,
        )
      : [];

    if (ltv && !editOffer?.publicKey) {
      parsedOffers.push(myOffer);
    }

    const offers = editOfferPubkey ? parsedEditableOffers : parsedOffers;

    const sortedOffersByInterest = sortOffersByInterest(offers, 'desc');

    const sortedByLtv = sortOffersByLtv(sortedOffersByInterest, 'desc');

    const ownerOffers = sortedByLtv.filter(
      (pair) => pair.rawData?.assetReceiver === publicKey?.toBase58(),
    );

    return [sortedByLtv, ownerOffers];
  }, [pairs, walletOwned, publicKey, ltv, size, interest]);

  const bestOffer = useMemo(() => {
    return allOffers.at(0)?.synthetic ? allOffers.at(1) : allOffers.at(0);
  }, [allOffers]);

  return {
    offers: walletOwned
      ? ownerOffers
      : allOffers.filter((offer) => offer.interest >= 0),
    isLoading,
    hidePair,
    bestOffer,
  };
};
