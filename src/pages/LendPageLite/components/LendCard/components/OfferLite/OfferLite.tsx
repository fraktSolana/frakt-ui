import { FC } from 'react';
import classNames from 'classnames';

import { colorByPercentOffers, getColorByPercent } from '@frakt/utils/bonds';
import { Pencil } from '@frakt/icons';

import { calculateLeftPosition, calculateLineLeftPosition } from './helpers';
import { MarketOrder } from '../OrderBookLite';

import styles from './OfferLite.module.scss';

interface OfferLiteProps {
  order: MarketOrder;
  bestOffer: MarketOrder;
  isOwnOrder: boolean;
  editOrder: () => void;
  size: number;
  loanValue: number;
  loanAmount: number;
  marketFloor: number;
}

const OfferLite: FC<OfferLiteProps> = ({
  order,
  bestOffer,
  loanValue,
  marketFloor,
  loanAmount,
  size,
  isOwnOrder,
  editOrder,
}) => {
  const isBestOffer = order.rawData.publicKey === bestOffer?.rawData.publicKey;

  const maxLoanValue = Math.min((loanValue / marketFloor) * 100, 100);

  const displayLoanAmount = loanAmount < 1 ? '< 1' : loanAmount || 0;
  const displaySize = isOwnOrder ? `/ ${size?.toFixed(2)} ◎` : '';

  const listItemClassName = classNames(styles.listItem, {
    [styles.highlightBest]: isBestOffer,
    [styles.highlightYourOffer]: order.synthetic,
  });

  return (
    <li className={listItemClassName}>
      <ValueDisplay
        label="Offer"
        displayValue={loanValue}
        maxLoanValue={maxLoanValue}
      />
      <div className={styles.valueWrapper}>
        <p className={styles.value}>
          {displayLoanAmount} {displaySize}
        </p>
      </div>
      {isOwnOrder && editOrder && (
        <div className={styles.editButton} onClick={editOrder}>
          <Pencil />
        </div>
      )}
    </li>
  );
};

export default OfferLite;

const ValueDisplay = ({ displayValue = 0, maxLoanValue = 0, label = '' }) => {
  const colorValue = getColorByPercent(maxLoanValue, colorByPercentOffers);

  const valueStyle = {
    background: colorValue,
    left: calculateLeftPosition(maxLoanValue),
  };

  const lineStyle = {
    borderColor: colorValue,
    left: calculateLineLeftPosition(maxLoanValue),
  };

  const formattedValue = (displayValue || 0)?.toFixed(2);

  return (
    <>
      <div className={styles.loanValue} style={valueStyle}>
        {label}:<span>{formattedValue}◎</span>
      </div>
      <div className={styles.line} style={lineStyle} />
    </>
  );
};
