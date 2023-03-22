import { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { web3 } from 'fbonds-core';
import { groupWith } from 'ramda';

import { ArrowDownTableSort, ArrowUpTableSort, Chevron } from '@frakt/icons';
import { RadioButton, RBOption } from '@frakt/components/RadioButton';
import { NavigationButton } from '@frakt/components/Button';
import { Loader } from '@frakt/components/Loader';
import Toggle from '@frakt/components/Toggle';
import { Market } from '@frakt/api/bonds';
import { PATHS } from '@frakt/constants';

import CollectionsList from './components/CollectionsList';
import { isOwnOrder, makeEditOrderPath } from './helpers';
import NoActiveOffers from './components/NoActiveOffers';
import { SortOrder, SyntheticParams } from './types';
import { DURATION_OPTIONS } from './constants';
import { useMarketOrders } from './hooks';
import Offer from './components/Offer';

import styles from './OrderBook.module.scss';

interface OrderBookProps {
  market: Market;
  marketLoading?: boolean;
  syntheticParams?: SyntheticParams;
}

const OrderBook: FC<OrderBookProps> = ({ market, syntheticParams }) => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();

  const [openOffersMobile, setOpenOffersMobile] = useState<boolean>(false);
  const [showOwnOrders, setShowOwnOrders] = useState<boolean>(false);
  const [sort, setSort] = useState<SortOrder>(SortOrder.DESC);
  const [duration, setDuration] = useState<number>(7);

  const toggleOffers = () => setOpenOffersMobile((prev) => !prev);

  const onDurationChange = (nextOption: RBOption<number>) => {
    setDuration(nextOption.value);
  };

  const toggleSort = () => {
    sort === SortOrder.DESC ? setSort(SortOrder.ASC) : setSort(SortOrder.DESC);
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

  return (
    <div
      className={classNames(styles.orderBook, {
        [styles.active]: openOffersMobile,
        [styles.create]: syntheticParams?.ltv,
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
          <div className={styles.filters}>
            <RadioButton
              className={styles.radioButton}
              currentOption={{
                label: `${duration}`,
                value: duration,
              }}
              onOptionChange={onDurationChange}
              options={DURATION_OPTIONS}
            />
            <Toggle
              label="My offers"
              className={classNames(styles.toggle, {
                [styles.active]: openOffersMobile,
              })}
              defaultChecked={showOwnOrders}
              onChange={(nextValue) => setShowOwnOrders(nextValue)}
            />
          </div>

          <div
            className={classNames(styles.columnWrapper, {
              [styles.active]: openOffersMobile,
              [styles.create]: syntheticParams?.ltv,
            })}
          >
            <div className={styles.col}>
              <span className={styles.colName}>size</span>
              <span>(SOL)</span>
            </div>
            <div onClick={toggleSort} className={styles.col}>
              <span className={styles.colName}>Interest</span>
              <span>(%)</span>
              {sort === 'desc' ? <ArrowDownTableSort /> : <ArrowUpTableSort />}
            </div>
          </div>
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
              sortDirection={sort}
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
                  editOrder={() =>
                    makeEditOrderPath(offer, market?.marketPubkey)
                  }
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
