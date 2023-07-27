import { useMemo } from 'react';

import { parseMarketOrder } from '@frakt/pages/MarketsPage/components/OrderBook/helpers';
import { useMarketPairs } from '@frakt/utils/bonds/hooks';
import { useWallet } from '@solana/wallet-adapter-react';

import { MarketOrder } from '../types';

const SYNTHETIC_INTEREST = 0;
const SYNTHETIC_LTV = 100;

export const useLiteMarketOrders = ({
  marketPubkey,
  size,
  loanValue,
  loanAmount,
  pairPubkey,
}) => {
  const { publicKey } = useWallet();
  const { pairs, isLoading } = useMarketPairs({ marketPubkey });

  const offers = useMemo(() => {
    if (!pairs) return [];

    const editOffer = pairs.find(({ publicKey }) => publicKey === pairPubkey);
    const editOfferPubkey = editOffer?.publicKey;

    const myOffer: MarketOrder = {
      ltv: SYNTHETIC_LTV,
      size: size / 1e9,
      interest: SYNTHETIC_INTEREST,
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

    if (loanAmount && !editOfferPubkey) {
      parsedOffers.push(myOffer);
    }

    const offers = editOfferPubkey ? parsedEditableOffers : parsedOffers;

    return offers;
  }, [pairs, publicKey, loanValue, loanAmount]);

  return {
    offers: offers.filter((offer) => offer.interest >= 0),
    isLoading,
  };
};
