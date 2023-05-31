import { FC, PropsWithChildren } from 'react';
import classNames from 'classnames';
import { isNumber } from 'lodash';

import { formatNumbersWithCommans } from '@frakt/utils';
import { Solana } from '@frakt/icons';

import styles from './DashboardStatsValues.module.scss';

export enum VALUES_TYPES {
  string = 'string',
  percent = 'percent',
  solPrice = 'solPrice',
}

const DIMENSTION_BY_VALUE_TYPE: Record<VALUES_TYPES, JSX.Element> = {
  [VALUES_TYPES.string]: null,
  [VALUES_TYPES.percent]: <>{'%'}</>,
  [VALUES_TYPES.solPrice]: <Solana className={styles.icon} />,
};

interface DashboardStatsValuesProps {
  label: string;
  value?: number | string | JSX.Element;
  className?: string;
  valueType?: VALUES_TYPES;
  reverse?: boolean;
  toFixed?: number;
}

export const DashboardColumnValue: FC<
  PropsWithChildren<DashboardStatsValuesProps>
> = ({
  label,
  className,
  value,
  reverse,
  valueType = VALUES_TYPES.solPrice,
  toFixed = 2,
}) => {
  const formattedValue = formatValue(value, valueType, toFixed);

  return (
    <div
      className={classNames(styles.column, className, {
        [styles.reverse]: reverse,
      })}
    >
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>
        {formattedValue} {DIMENSTION_BY_VALUE_TYPE[valueType]}
      </div>
    </div>
  );
};

const formatValue = (
  value: number | string | JSX.Element,
  type: VALUES_TYPES,
  toFixed: number,
) => {
  if (type === VALUES_TYPES.solPrice && isNumber(value)) {
    const roundedValue = value?.toFixed(toFixed);

    const formatedNumbersWithCommans = formatNumbersWithCommans(roundedValue);
    return formatedNumbersWithCommans;
  }

  return value;
};
