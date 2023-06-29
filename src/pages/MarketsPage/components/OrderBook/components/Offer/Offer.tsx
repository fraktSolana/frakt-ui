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
  editOrder?: () => void;
  ltv?: number;
  size: number;
  interest?: number;
  duration: number;
  loanValue?: number;
  loanAmount?: number;
  marketFloor?: number;
}
const Offer: FC<OfferProps> = ({
  order,
  bestOffer,
  isOwnOrder,
  editOrder,
  ltv,
  size,
  interest,
  duration,
  loanValue,
  loanAmount,
  marketFloor,
}) => {
  const maxLoanValue = Math.min((loanValue / marketFloor) * 100, 100);

  const shouldDisplayLTV = ltv !== undefined;
  const shouldDisplayLoanValue = loanValue !== undefined;
  const isBestOffer = order.rawData.publicKey === bestOffer?.rawData.publicKey;
  const isOwnOffer = order.synthetic;

  const listItemClassName = classNames(styles.listItem, {
    [styles.highlightBest]: isBestOffer,
    [styles.highlightYourOffer]: isOwnOffer,
  });

  return (
    <li className={listItemClassName}>
      {shouldDisplayLTV && (
        <ValueDisplay
          value={ltv}
          className={styles.ltv}
          label="LTV"
          maxPercent={27}
          offset={74}
        />
      )}
      {shouldDisplayLoanValue && (
        <ValueDisplay
          value={loanValue || 0}
          className={styles.loanValue}
          styleValue={maxLoanValue}
          label="Offer"
          maxPercent={36}
          offset={110}
          isSolPrice
        />
      )}
      <div className={styles.valueWrapper}>
        <div className={classNames(styles.value, styles.sizeValue)}>
          {size?.toFixed(3)}
        </div>
        <LoanAmountOrInterest loanAmount={loanAmount} interest={interest} />
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

const LoanAmountOrInterest = ({ loanAmount = 0, interest = 0 }) => {
  if (interest) {
    const formattedInterest = (interest * 100)?.toFixed(2);
    return <p className={styles.value}>{formattedInterest}</p>;
  }

  const displayLoanAmount = loanAmount < 1 ? '< 1' : loanAmount || 0;

  return (
    <p className={classNames(styles.value, styles.loanAmountValue)}>
      {displayLoanAmount}
    </p>
  );
};
