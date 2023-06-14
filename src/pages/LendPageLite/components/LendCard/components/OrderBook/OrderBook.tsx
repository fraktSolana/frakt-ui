import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { groupWith } from 'ramda';

import NoActiveOffers from '@frakt/pages/MarketsPage/components/OrderBook/components/NoActiveOffers';
import { useMarketOrders } from '@frakt/pages/MarketsPage/components/OrderBook/hooks';
import Offer from '@frakt/pages/MarketsPage/components/OrderBook/components/Offer';
import { useMarket } from '@frakt/utils/bonds';
import { PATHS } from '@frakt/constants';
import { Chevron } from '@frakt/icons';
import {
  MarketOrder,
  SyntheticParams,
} from '@frakt/pages/MarketsPage/components/OrderBook/types';

import { calculateLoanValue } from '../PlaceOfferTab';
import styles from './OrderBook.module.scss';

const OrderBook: FC<{
  marketPubkey: string;
  syntheticParams?: SyntheticParams;
}> = ({ marketPubkey, syntheticParams }) => {
  const wallet = useWallet();
  const history = useHistory();

  const isOwnOrder = (order: MarketOrder): boolean => {
    return order?.rawData?.assetReceiver === wallet?.publicKey?.toBase58();
  };

  const { market } = useMarket({ marketPubkey });

  const {
    offers: offersRaw,
    isLoading,
    bestOffer,
  } = useMarketOrders({
    marketPubkey: marketPubkey && new web3.PublicKey(marketPubkey),
    ltv: syntheticParams?.ltv,
    size: syntheticParams?.offerSize,
    interest: syntheticParams?.interest,
    duration: syntheticParams?.durationDays,
    loanValue: syntheticParams?.loanValue,
    loanAmount: syntheticParams?.loanAmount,
  });

  const [openOffersMobile, setOpenOffersMobile] = useState<boolean>(true);

  const toggleOffers = () => setOpenOffersMobile((prev) => !prev);

  const goToEditOffer = (orderPubkey: string) =>
    history.push(`${PATHS.BONDS_LITE}/${marketPubkey}/${orderPubkey}`);

  const offersExist = Boolean(offersRaw.length);

  const offers = groupWith(
    (offerA, offerB) =>
      offerA.interest === offerB.interest &&
      offerA.ltv === offerB.ltv &&
      !isOwnOrder(offerA) &&
      !isOwnOrder(offerB),
    offersRaw,
  ).map((squashedOffers) =>
    squashedOffers.reduce((accOffer, offer) => ({
      ...accOffer,
      size: accOffer.size + offer.size,
    })),
  );

  return (
    <div
      className={classNames(styles.orderBook, {
        [styles.active]: openOffersMobile,
      })}
    >
      <>
        <ChevronMobileButton
          onToggleVisible={toggleOffers}
          active={!openOffersMobile}
        />
        <h5 className={styles.title}>Offers</h5>
        <div
          className={classNames(styles.label, {
            [styles.hidden]: openOffersMobile,
          })}
        >
          <span>Size ◎</span>
          <span>Loan amount</span>
        </div>
        <div
          className={classNames(styles.content, {
            [styles.active]: openOffersMobile,
            [styles.visible]: !offersExist,
          })}
        >
          {!isLoading && offersExist && (
            <ul
              className={classNames(styles.list, {
                [styles.active]: openOffersMobile,
              })}
            >
              {offers.map((offer, idx) => {
                const { size, duration, synthetic, rawData } = offer;
                const marketFloor = market?.oracleFloor?.floor;

                const loanValue = synthetic
                  ? offer?.loanValue * 1e9
                  : calculateLoanValue(offer, marketFloor);

                const loanAmount = synthetic
                  ? offer?.loanAmount
                  : Math.round(rawData?.fundsSolOrTokenBalance / loanValue);

                return (
                  <Offer
                    key={idx}
                    size={size}
                    loanValue={loanValue / 1e9}
                    loanAmount={loanAmount}
                    order={offer}
                    bestOffer={bestOffer}
                    duration={duration}
                    editOrder={() => goToEditOffer(rawData?.publicKey)}
                    isOwnOrder={isOwnOrder(offer)}
                    marketFloor={marketFloor / 1e9}
                  />
                );
              })}
            </ul>
          )}
          {!isLoading && !offersExist && !syntheticParams?.ltv && (
            <NoActiveOffers
              ltv={syntheticParams?.ltv}
              openOffersMobile={openOffersMobile}
            />
          )}
        </div>
      </>
    </div>
  );
};

export default OrderBook;

const ChevronMobileButton = ({ active, onToggleVisible }) => (
  <div
    onClick={onToggleVisible}
    className={classNames(styles.chevronButton, {
      [styles.active]: active,
    })}
  >
    <Chevron />
  </div>
);
