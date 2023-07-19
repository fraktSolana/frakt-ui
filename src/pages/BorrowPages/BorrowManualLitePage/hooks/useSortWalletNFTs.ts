import { useMemo, useState } from 'react';
import { sortBy, get } from 'lodash';

import { Option } from '@frakt/components/SortDropdown';
import { BorrowNft } from '@frakt/api/nft';

import { defaultSortOption } from '../constants';

enum SortField {
  NAME = 'name',
  MAX_LOAN_VALUE = 'maxLoanValue',
}

export const useSortWalletNFTs = (nfts: BorrowNft[]) => {
  const [sortOption, setSortOption] = useState<Option>(defaultSortOption);

  const sortOptionValue = sortOption?.value;

  const sortedNFTs = useMemo(() => {
    if (!sortOptionValue) {
      return nfts;
    }

    const [name, order] = sortOptionValue.split('_');

    const sortValueMapping: Record<SortField, string> = {
      [SortField.NAME]: 'name',
      [SortField.MAX_LOAN_VALUE]: 'maxLoanValue',
    };

    const sorted = sortBy(nfts, (loan) => {
      const sortValue = sortValueMapping[name];
      return get(loan, sortValue);
    });

    return order === 'desc' ? sorted.reverse() : sorted;
  }, [sortOptionValue, nfts]);

  return {
    sortedNFTs,
    sortParams: {
      option: sortOption,
      onChange: setSortOption,
    },
  };
};
