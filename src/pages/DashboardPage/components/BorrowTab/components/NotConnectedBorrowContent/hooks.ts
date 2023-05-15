import { useState } from 'react';
import { orderBy } from 'lodash';

import { useMarketsPreview } from '@frakt/pages/MarketsPage/hooks';
import { useDebounce, useWindowSize } from '@frakt/hooks';
import { TABLET_SIZE } from '@frakt/constants';

import { parseMarketsPreview } from './helpers';

export const useNotConnectedBorrowContent = () => {
  const { marketsPreview, isLoading } = useMarketsPreview();

  const { width } = useWindowSize();
  const isMobile = width <= TABLET_SIZE;

  const [search, setSearch] = useState<string>('');

  const setSearchDebounced = useDebounce((value: string) => {
    setSearch(value);
  }, 300);

  const collections = parseMarketsPreview(marketsPreview);

  const filteredCollections = collections.filter(({ name }) => {
    return name.toUpperCase().includes(search.toUpperCase());
  });

  const filteredCollectionsByAmount = orderBy(
    filteredCollections,
    ({ bestOffer }) => bestOffer,
    'desc',
  );

  return {
    collections: filteredCollectionsByAmount,
    setSearch: setSearchDebounced,
    isMobile,
    isLoading: isLoading && !collections?.length,
  };
};
