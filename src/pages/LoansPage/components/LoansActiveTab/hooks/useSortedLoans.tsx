import { useMemo } from 'react';
import { sortBy, get, isEmpty, isFunction } from 'lodash';

import { Loan, LoanType } from '@frakt/api/loans';

enum SortField {
  BORROWED = 'loanValue',
  DEBT = 'repayValue',
  DURATION = 'duration',
  HEALTH = 'health',
  INTEREST = 'interest',
  LIQUIDATION_PRICE = 'liquidationPrice',
}

export const useSortedLoans = (loans: Loan[], sortOptionValue: string) => {
  const sortedLoans = useMemo(() => {
    if (!sortOptionValue) {
      return loans;
    }

    const [name, order] = sortOptionValue.split('_');

    type SortValueGetter = (loan: Loan) => string | number;

    const sortValueMapping: Record<SortField, string | SortValueGetter> = {
      [SortField.BORROWED]: 'loanValue',
      [SortField.DEBT]: 'repayValue',
      [SortField.DURATION]: (loan: Loan) => {
        const timeToRepay =
          loan.classicParams?.timeBased?.expiredAt ||
          loan?.bondParams?.expiredAt;

        return timeToRepay || 0;
      },
      [SortField.HEALTH]: 'classicParams.priceBased.health',
      [SortField.INTEREST]: 'classicParams.priceBased.borrowAPRPercent',
      [SortField.LIQUIDATION_PRICE]:
        'classicParams.priceBased.liquidationPrice',
    };

    const sorted = sortBy(loans, (loan) => {
      const sortValue = sortValueMapping[name];
      return isFunction(sortValue) ? sortValue(loan) : get(loan, sortValue);
    });

    return order === 'desc' ? sorted.reverse() : sorted;
  }, [sortOptionValue, loans]);

  return sortedLoans;
};
