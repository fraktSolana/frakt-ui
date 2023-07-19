import { useMemo } from 'react';
import { sortBy, get } from 'lodash';

import { LiquidityPool } from '@frakt/api/pools';

enum SortField {
  NAME = 'name',
  TOTAL_LIQUIDITY = 'totalLiquidity',
  DEPOSIT_YIELD = 'depositYield',
}

export const useSortedPools = (
  loans: LiquidityPool[],
  sortOptionValue: string,
) => {
  const sortedLoans = useMemo(() => {
    if (!sortOptionValue) {
      return loans;
    }

    const [name, order] = sortOptionValue.split('_');

    const sortValueMapping: Record<SortField, string> = {
      [SortField.NAME]: 'name',
      [SortField.TOTAL_LIQUIDITY]: 'totalLiquidity',
      [SortField.DEPOSIT_YIELD]: 'depositApr',
    };

    const sorted = sortBy(loans, (loan) => {
      const sortValue = sortValueMapping[name];
      return get(loan, sortValue);
    });

    return order === 'desc' ? sorted.reverse() : sorted;
  }, [sortOptionValue, loans]);

  return sortedLoans;
};
