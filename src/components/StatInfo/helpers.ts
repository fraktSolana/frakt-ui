import { isNumber } from 'lodash';

import { formatNumbersWithCommans } from '@frakt/utils';
import { VALUES_TYPES } from './constants';

import styles from './StatInfo.module.scss';

export const formatValue = (
  value: number | string | JSX.Element,
  type: VALUES_TYPES,
  decimalPlaces: number,
  divider = 1,
) => {
  if (type === VALUES_TYPES.solPrice && isNumber(value)) {
    const roundedValue = (value / divider)?.toFixed(decimalPlaces);

    return formatNumbersWithCommans(roundedValue);
  }

  return value;
};

export const getFlexStyle = (flexType?: 'row' | 'column') => {
  if (flexType === 'row') {
    return styles.rowFlex;
  } else if (flexType === 'column') {
    return styles.columnFlex;
  } else {
    return '';
  }
};
