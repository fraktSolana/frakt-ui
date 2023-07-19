import { FC } from 'react';
import classNames from 'classnames';

import { Pencil } from '@frakt/icons';

import { ValueDisplay } from './ValueDisplay';
import { MarketOrder } from '../../types';

import styles from './Offer.module.scss';

interface OfferProps {
  order: MarketOrder;
  bestOffer: MarketOrder;
  isOwnOrder: boolean;
  editOrder: () => void;
  ltv: number;
  size: number;
  interest: number;
  duration: number;
}
const Offer: FC<OfferProps> = ({
  order,
  bestOffer,
  isOwnOrder,
  editOrder,
  ltv,
  size,
  interest,
}) => {
  const isBestOffer = order.rawData.publicKey === bestOffer?.rawData.publicKey;
  const isOwnOffer = order.synthetic;

  const listItemClassName = classNames(styles.listItem, {
    [styles.highlightBest]: isBestOffer,
    [styles.highlightYourOffer]: isOwnOffer,
  });

  const formattedInterest = (interest * 100)?.toFixed(2);

  return (
    <li className={listItemClassName}>
      <ValueDisplay
        value={ltv}
        className={styles.ltv}
        label="LTV"
        maxPercent={27}
        offset={74}
      />

      <div className={styles.valueWrapper}>
        <div className={classNames(styles.value, styles.sizeValue)}>
          {size?.toFixed(2)}
        </div>
        <p className={styles.value}>{formattedInterest}</p>
      </div>
      {isOwnOrder && editOrder && (
        <div className={styles.editButton} onClick={editOrder}>
          <Pencil />
        </div>
      )}
    </li>
  );
};

export default Offer;
