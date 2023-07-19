import { FC, PropsWithChildren } from 'react';
import classNames from 'classnames';

import { Chevron } from '@frakt/icons';

import { getNormalizedLoanAmount, getNormalizedLoanValue } from './helpers';
import { MarketOrder, OrderBookParams } from './types';
import OfferLite from '../OfferLite';

import styles from './OrderBookLite.module.scss';

interface OrderBookListProps {
  active: boolean;
  orderBookParams: OrderBookParams;
}

export const OrderBookList: FC<OrderBookListProps> = ({
  active,
  orderBookParams,
}) => {
  const { marketFloor, offers, bestOffer, goToEditOffer, isOwnOrder } =
    orderBookParams || {};

  const renderOffer = (offer: MarketOrder, idx: number) => {
    const loanValueLamports = getNormalizedLoanValue(offer, marketFloor);
    const loanAmount = getNormalizedLoanAmount(offer, loanValueLamports);

    return (
      <OfferLite
        key={idx}
        size={offer?.size}
        order={offer}
        bestOffer={bestOffer}
        loanAmount={loanAmount}
        marketFloor={marketFloor / 1e9}
        loanValue={loanValueLamports / 1e9}
        isOwnOrder={isOwnOrder(offer)}
        editOrder={() => goToEditOffer(offer?.rawData?.publicKey)}
      />
    );
  };

  return (
    <ul className={classNames(styles.list, { [styles.active]: active })}>
      {offers.map(renderOffer)}
    </ul>
  );
};

export const ChevronMobileButton = ({
  active = false,
  onToggleVisible = null,
}) => (
  <div
    onClick={onToggleVisible}
    className={classNames(styles.chevronButton, {
      [styles.active]: active,
    })}
  >
    <Chevron />
  </div>
);

export const OrderBookWrapper: FC<PropsWithChildren<{ active: boolean }>> = ({
  children,
  active,
}) => (
  <div
    className={classNames(styles.orderBook, {
      [styles.active]: active,
    })}
  >
    {children}
  </div>
);

export const OrderBookLabel = ({ hidden = false }) => (
  <div
    className={classNames(styles.label, {
      [styles.hidden]: hidden,
    })}
  >
    <span>Loan amount</span>
  </div>
);

export const NoActiveOffers = ({
  active = false,
  isSelectedOffers = false,
}) => (
  <div
    className={classNames(styles.noData, {
      [styles.active]: active,
      [styles.create]: isSelectedOffers,
    })}
  >
    <div className={styles.noDataTitle}>No active offers at the moment</div>
    <div className={styles.noDataSubtitle}>Good chance to be first!</div>
  </div>
);
