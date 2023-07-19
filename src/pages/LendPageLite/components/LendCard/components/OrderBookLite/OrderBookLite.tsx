import { FC } from 'react';
import classNames from 'classnames';

import { Loader } from '@frakt/components/Loader';
import { useOrderBookLite } from './hooks';
import { SyntheticParams } from './types';
import {
  ChevronMobileButton,
  NoActiveOffers,
  OrderBookLabel,
  OrderBookList,
  OrderBookWrapper,
} from './components';

import styles from './OrderBookLite.module.scss';

interface OrderBookProps {
  pairPubkey: string;
  marketPubkey: string;
  syntheticParams?: SyntheticParams;
  setPairPubkey: (pairPubkey: string) => void;
}

const OrderBookLite: FC<OrderBookProps> = (props) => {
  const {
    openOffersMobile,
    toggleOffers,
    offersExist,
    orderBookParams,
    isSelectedOffers,
    showNoActiveOffers,
    showOrderBook,
    showLoader,
  } = useOrderBookLite({ ...props });

  return (
    <OrderBookWrapper active={openOffersMobile}>
      <>
        <ChevronMobileButton
          onToggleVisible={toggleOffers}
          active={!openOffersMobile}
        />
        <h5 className={styles.title}>Offers</h5>
        <OrderBookLabel hidden={openOffersMobile} />
        <div
          className={classNames(styles.content, {
            [styles.active]: openOffersMobile,
            [styles.visible]: !offersExist,
          })}
        >
          {showOrderBook && (
            <OrderBookList
              orderBookParams={orderBookParams}
              active={openOffersMobile}
            />
          )}
          {showLoader && <Loader />}
          {showNoActiveOffers && (
            <NoActiveOffers
              isSelectedOffers={isSelectedOffers}
              active={openOffersMobile}
            />
          )}
        </div>
      </>
    </OrderBookWrapper>
  );
};

export default OrderBookLite;
