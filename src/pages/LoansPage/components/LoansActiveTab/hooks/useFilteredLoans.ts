import { useMemo } from 'react';
import { filter, includes, isEmpty, partition } from 'lodash';

import { useTabs } from '@frakt/components/Tabs';
import { Loan } from '@frakt/api/loans';

export const useFilteredLoans = (loans: Loan[], selectedOptions: string[]) => {
  const [priceBasedLoans, nonPriceBasedLoans] = partition(
    loans,
    (loan) => loan.classicParams?.priceBased,
  );

  const temporaryCount = nonPriceBasedLoans.length;
  const perpetualCount = priceBasedLoans.length;

  const durationTabs = createDurationTabs(temporaryCount, perpetualCount);

  const {
    tabs,
    value: duration,
    setValue: setDuration,
  } = useTabs({ tabs: durationTabs, defaultValue: durationTabs[0].value });

  const filteredByDuration = useMemo(() => {
    const sorted = loans.filter((loan) => {
      if (duration === '0') {
        return !isEmpty(loan.classicParams?.priceBased);
      }
      return isEmpty(loan.classicParams?.priceBased);
    });

    return sorted;
  }, [duration, loans]);

  const filteredByCollectionName = useMemo(() => {
    if (selectedOptions.length) {
      return filter(filteredByDuration, (loan) =>
        includes(selectedOptions, loan.nft.collectionName),
      );
    }
    return filteredByDuration;
  }, [filteredByDuration, selectedOptions]);

  return {
    filteredByDuration,
    filteredLoans: filteredByCollectionName,
    tabsProps: {
      tabs,
      value: duration,
      setValue: setDuration,
    },
  };
};

const createDurationTabs = (temporaryCount = 0, perpetualCount = 0) => [
  {
    label: `7 days: ${temporaryCount}`,
    value: '7',
  },
  {
    label: `Perpetual: ${perpetualCount}`,
    value: '0',
  },
];
