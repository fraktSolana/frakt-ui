import { FC, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { web3 } from 'fbonds-core';
import { groupWith } from 'ramda';

import { Chevron } from '@frakt/icons';
import { NavigationButton } from '@frakt/components/Button';
import { Loader } from '@frakt/components/Loader';
import Toggle from '@frakt/components/Toggle';
import { Market } from '@frakt/api/bonds';
import { PATHS } from '@frakt/constants';

import CollectionsList from './components/CollectionsList';
import NoActiveOffers from './components/NoActiveOffers';
import { MarketOrder, SortOrder, SyntheticParams } from './types';
import Filters from './components/Filters';
import { useMarketOrders } from './hooks';
import Offer from './components/Offer';

import styles from './OrderBook.module.scss';
import Sort from './components/Sort';

interface OrderBookProps {
  market: Market;
  marketLoading?: boolean;
  syntheticParams?: SyntheticParams;
}

const OrderBook: FC<OrderBookProps> = ({ market, syntheticParams }) => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const history = useHistory();
  const wallet = useWallet();

  const [openOffersMobile, setOpenOffersMobile] = useState<boolean>(false);
  const [showOwnOrders, setShowOwnOrders] = useState<boolean>(false);
  const [sort, setSort] = useState<SortOrder>(SortOrder.DESC);
  const [duration, setDuration] = useState<number>(30);

  const toggleOffers = () => setOpenOffersMobile((prev) => !prev);

  const onDurationChange = (nextValue: number) => {
    setDuration(nextValue);
  };

  const toggleSort = () => {
    sort === SortOrder.DESC ? setSort(SortOrder.ASC) : setSort(SortOrder.DESC);
  };

  const isOwnOrder = (order: MarketOrder): boolean => {
    return order?.rawData?.assetReceiver === wallet?.publicKey?.toBase58();
  };

  const {
    offers: offersRaw,
    isLoading,
    offersExist,
  } = useMarketOrders({
    marketPubkey:
      market?.marketPubkey && new web3.PublicKey(market?.marketPubkey),
    sortDirection: sort,
    filterDuration: duration,
    walletOwned: showOwnOrders,
    ltv: syntheticParams?.ltv,
    size: syntheticParams?.offerSize,
    interest: syntheticParams?.interest,
    duration: syntheticParams?.durationDays,
  });

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

  const bestOffer = useMemo(() => {
    return offers.at(0)?.synthetic ? offers.at(1) : offers.at(0);
  }, [offers]);

  const goToEditOffer = (orderPubkey: string) =>
    history.push(`${PATHS.OFFER}/${marketPubkey}/${orderPubkey}`);

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
            <Filters
              openOffersMobile={openOffersMobile}
              duration={duration}
              onSortChange={onDurationChange}
            />
            <Toggle
              label="My offers only"
              className={classNames(styles.toggle, {
                [styles.active]: openOffersMobile,
              })}
              defaultChecked={showOwnOrders}
              onChange={(nextValue) => setShowOwnOrders(nextValue)}
            />
          </div>
          {marketPubkey && offersExist && (
            <Sort onChangeSort={toggleSort} sort={sort} />
          )}
        </div>

        <div
          className={classNames(styles.content, {
            [styles.active]: openOffersMobile,
            [styles.create]: syntheticParams?.ltv,
            [styles.visible]: !offersExist,
          })}
        >
          {isLoading && marketPubkey && (
            <Loader
              size="default"
              className={classNames(styles.loader, {
                [styles.active]: openOffersMobile,
                [styles.create]: syntheticParams?.ltv,
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
              {offers.map((offer, idx) => (
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
              className={styles.btn}
              path={`${PATHS.OFFER}/${market?.marketPubkey}`}
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
