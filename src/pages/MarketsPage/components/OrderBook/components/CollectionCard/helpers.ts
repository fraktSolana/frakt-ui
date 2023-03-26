import { useWallet } from '@solana/wallet-adapter-react';

import { sortOffersByInterest, sortOffersByLtv } from '../../helpers';
import { MarketOrder } from '../../types';

const sortOffers = (offers: MarketOrder[], sortDirection: string) => {
  const sortedOffersByInterest = sortOffersByInterest(offers, sortDirection);
  const sortedByLtv = sortOffersByLtv(sortedOffersByInterest, sortDirection);

  return sortedByLtv;
};

const getOnlyOwnerOffers = (offers: MarketOrder[]) => {
  const { publicKey } = useWallet();

  return offers.filter(
    (offer) => offer.rawData.publicKey === publicKey?.toBase58(),
  );
};

export { sortOffers, getOnlyOwnerOffers };
