import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';

export interface MarketOrder {
  ltv: number;
  size: number;
  interest: number;
  synthetic?: boolean;
  duration: number;
  loanValue: number;
  loanAmount: number;
  rawData: {
    publicKey: string;
    assetReceiver: string;
    authorityAdapter: string;
    edgeSettlement: number;
    bondFeature?: BondFeatures;
    maxReturnAmountFilter?: number;
    fundsSolOrTokenBalance?: number;
    loanToValueFilter?: number;
  };
}

export interface SyntheticParams {
  offerSize: number;
  loanValue: number;
  loanAmount: number;
}

export interface OrderBookParams {
  offers: MarketOrder[];
  bestOffer: MarketOrder;
  marketFloor: number;
  goToEditOffer: (orderPubkey: string) => void;
  isOwnOrder: (order: MarketOrder) => boolean;
}

export type UseOrderBookLite = ({
  pairPubkey,
  marketPubkey,
  syntheticParams,
  setPairPubkey,
}: {
  pairPubkey: string;
  marketPubkey: string;
  syntheticParams?: SyntheticParams;
  setPairPubkey: (pairPubkey: string) => void;
}) => {
  showNoActiveOffers: boolean;
  showOrderBook: boolean;
  offersExist: boolean;
  showLoader: boolean;
  openOffersMobile: boolean;
  isSelectedOffers: boolean;
  toggleOffers: () => void;
  orderBookParams: OrderBookParams;
  collectionName: string;
  collectionImage: string;
};
