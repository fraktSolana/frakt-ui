import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { web3 } from 'fbonds-core';

import { Chevron } from '@frakt/icons';
import { NavigationButton } from '@frakt/components/Button';
import { Loader } from '@frakt/components/Loader';
import Toggle from '@frakt/components/Toggle';
import { Market } from '@frakt/api/bonds';
import { PATHS } from '@frakt/constants';
import { groupWith } from '@frakt/utils';

import { MarketOrder, SyntheticParams } from './types';
import CollectionsList from './components/CollectionsList';
import NoActiveOffers from './components/NoActiveOffers';
import { useMarketOrders } from './hooks';
import Offer from './components/Offer';

import styles from './OrderBook.module.scss';
import Sort from './components/Sort';

const MIN_SIZE_FOR_VIEW = 0.001;

interface OrderBookProps {
  market: Market;
  marketLoading?: boolean;
  syntheticParams?: SyntheticParams;
}

const OrderBook: FC<OrderBookProps> = ({ market, syntheticParams }) => {
  const { marketPubkey, pairPubkey } = useParams<{
    marketPubkey: string;
    pairPubkey: string;
  }>();
  const history = useHistory();
  const { publicKey, connected } = useWallet();

  const [openOffersMobile, setOpenOffersMobile] = useState<boolean>(false);
  const [showOwnOrders, setShowOwnOrders] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(30);

  const toggleOffers = () => setOpenOffersMobile((prev) => !prev);

  const isOwnOrder = (order: MarketOrder): boolean => {
    return order?.rawData?.assetReceiver === publicKey?.toBase58();
  };

  const {
    offers: offersRaw,
    isLoading,
    bestOffer,
  } = useMarketOrders({
    marketPubkey:
      market?.marketPubkey && new web3.PublicKey(market?.marketPubkey),
    pairPubkey,
    walletOwned: showOwnOrders,
    ltv: syntheticParams?.ltv,
    size: syntheticParams?.offerSize,
    interest: syntheticParams?.interest,
  });

  const offersExist = Boolean(offersRaw.length);

  const offers = groupWith(
    offersRaw,
    (offerA, offerB) =>
      offerA.interest === offerB.interest &&
      offerA.ltv === offerB.ltv &&
      !isOwnOrder(offerA) &&
      !isOwnOrder(offerB),
  ).map((squashedOffers) =>
    squashedOffers.reduce((accOffer, offer) => ({
      ...accOffer,
      size: accOffer.size + offer.size,
    })),
  );

  const goToEditOffer = (orderPubkey: string) =>
    history.push(`${PATHS.OFFER}/${marketPubkey}/${orderPubkey}`);

  const filteredPositiveOffers = offers.filter(
    (offer) => offer?.size > MIN_SIZE_FOR_VIEW || isOwnOrder(offer),
  );

  return (
    <div
      className={classNames(styles.orderBook, {
        [styles.active]: openOffersMobile,
        [styles.create]: syntheticParams?.ltv,
        [styles.selected]: marketPubkey,
      })}
    >
      <>
        <div
          className={classNames(styles.roundBtn, styles.btnChevron, {
            [styles.active]: openOffersMobile,
          })}
          onClick={toggleOffers}
        >
          <Chevron />
        </div>

        <div
          className={classNames(styles.header, {
            [styles.active]: openOffersMobile,
            [styles.create]: syntheticParams?.ltv,
          })}
        >
          <h5 className={styles.title}>Offers</h5>
          <div
            className={classNames(styles.filters, {
              [styles.active]: openOffersMobile,
              [styles.create]: !!syntheticParams?.ltv,
            })}
          >
            {connected && (
              <Toggle
                label="Mine"
                className={classNames(styles.toggle, {
                  [styles.active]: openOffersMobile,
                })}
                defaultChecked={showOwnOrders}
                onChange={(nextValue) => setShowOwnOrders(nextValue)}
              />
            )}
          </div>
        </div>
        {marketPubkey && offersExist && (
          <Sort
            openOffersMobile={openOffersMobile}
            existSyntheticParams={!!syntheticParams?.ltv}
          />
        )}

        <div
          className={classNames(styles.content, {
            [styles.active]: openOffersMobile,
            [styles.create]: syntheticParams?.ltv,
          })}
        >
          {isLoading && marketPubkey && (
            <Loader
              size="default"
              className={classNames(styles.loader, {
                [styles.active]: openOffersMobile || syntheticParams?.ltv,
              })}
            />
          )}

          {!marketPubkey && (
            <CollectionsList
              openOffersMobile={openOffersMobile}
              existSyntheticParams={!!syntheticParams?.ltv}
              showOwnOrders={showOwnOrders}
              duration={duration}
            />
          )}

          {!isLoading && offersExist && (
            <ul
              className={classNames(styles.list, {
                [styles.create]: syntheticParams?.ltv,
                [styles.active]: openOffersMobile,
              })}
            >
              {filteredPositiveOffers.map((offer, idx) => (
                <Offer
                  ltv={offer.ltv}
                  size={offer.size}
                  interest={offer.interest}
                  order={offer}
                  bestOffer={bestOffer}
                  duration={offer.duration}
                  editOrder={() => goToEditOffer(offer?.rawData?.publicKey)}
                  isOwnOrder={isOwnOrder(offer)}
                  key={idx}
                />
              ))}
            </ul>
          )}
          {!isLoading && !offersExist && !syntheticParams?.ltv && (
            <NoActiveOffers
              ltv={syntheticParams?.ltv}
              openOffersMobile={openOffersMobile}
            />
          )}

          {!syntheticParams?.ltv && marketPubkey && (
            <NavigationButton
              className={classNames(styles.btn, {
                [styles.notActive]: !openOffersMobile,
              })}
              path={`${PATHS.OFFER}/${marketPubkey}`}
            >
              Place offers
            </NavigationButton>
          )}
        </div>
      </>
    </div>
  );
};

export default OrderBook;
