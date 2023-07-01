import { FC } from 'react';
import { colorByPercentOffers, getColorByPercent } from '@frakt/utils/bonds';

import styles from './Offer.module.scss';

interface ValueProps {
  value: number;
  className: string;
  label: string;
  maxPercent: number;
  offset: number;
  isSolPrice?: boolean;
  styleValue?: number;
}

export const ValueDisplay: FC<ValueProps> = ({
  value,
  className,
  label,
  maxPercent,
  offset,
  isSolPrice = false,
  styleValue: rowStyleValue,
}) => {
  const styleValue = rowStyleValue ? rowStyleValue : value;

  const colorValue = getColorByPercent(styleValue, colorByPercentOffers);
  const valueStyle = {
    background: colorValue,
    left:
      styleValue <= maxPercent
        ? `${styleValue}%`
        : `calc(${styleValue}%  - ${offset}px)`,
  };
  const lineStyle = {
    left:
      styleValue <= maxPercent
        ? `${styleValue}%`
        : `calc(${styleValue}%  - 4px)`,
    borderColor: colorValue,
  };

  const formattedValue = (value || 0)?.toFixed(isSolPrice ? 2 : 0);
  const unit = isSolPrice ? '◎' : '%';

  return (
    <>
      <div className={className} style={valueStyle}>
        {label}:
        <span>
          {formattedValue}
          {unit}
        </span>
      </div>
      <div className={styles.line} style={lineStyle} />
    </>
  );
};
