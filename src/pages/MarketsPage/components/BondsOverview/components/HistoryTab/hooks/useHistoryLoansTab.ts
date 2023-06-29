import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';

import { RBOption, useRBOptionState } from '@frakt/components/RadioButton';
import { useIntersection } from '@frakt/hooks/useIntersection';
import { useScrollPagination } from '@frakt/hooks';
import { BondHistory } from '@frakt/api/bonds';

import { useFetchBondsHistory, useHistoryBondsSort } from './hooks';
import { HISTORY_FILTER_OPTIONS } from '../constants';

export const useHistoryLoansTab = (
  initialMarketPubkey?: string,
  isFixedTable?: boolean,
) => {
  const { connected } = useWallet();
  const { ref, inView } = useIntersection();
  const { marketPubkey: routeMarketPubkey } = useParams<{
    marketPubkey: string;
  }>();

  const marketPubkey = initialMarketPubkey || routeMarketPubkey;

  const options = appendIdToOptionValue(HISTORY_FILTER_OPTIONS, marketPubkey);

  const [showOwnerBonds, setShowOwnerBonds] = useState<boolean>(false);
  const [selectedFilterOption, onChangeFilterOption] = useRBOptionState<string>(
    options[0].value,
  );

  const eventType = selectedFilterOption.split('_')[0];

  const { queryData } = useHistoryBondsSort();
  const {
    data: bondsHistory,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage = true,
    isLoading,
  } = useFetchBondsHistory({
    queryData,
    showOwnerBonds,
    eventType,
    marketPubkey,
  });

  const scrollContainer = document
    .getElementById(`historyTable_${marketPubkey}`)
    ?.querySelector('.ant-table-content');

  const { isLoading: isLoadingNextPage } = useScrollPagination<BondHistory>({
    scrollContainer,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    enable: isFixedTable,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  useEffect(() => {
    setShowOwnerBonds(connected);
  }, [connected]);

  const hasBondsHistory = !isLoading && !!bondsHistory.length;
  const showMessage = connected && showOwnerBonds;
  const shouldShowEmptyList =
    !hasBondsHistory && (showMessage || !showOwnerBonds) && !isLoading;

  const shouldShowLoader = isLoading && !bondsHistory.length;
  const shouldShowHistoryTable =
    hasBondsHistory && (showMessage || !showOwnerBonds);

  return {
    ref,
    selectedFilterOption,
    onChangeFilterOption,
    showOwnerBonds,
    setShowOwnerBonds,
    bondsHistory,
    isFetchingNextPage,
    isLoading,
    shouldShowEmptyList,
    shouldShowLoader,
    shouldShowHistoryTable,
    options,
    isLoadingNextPage,
  };
};

const appendIdToOptionValue = <T>(options: RBOption<T>[], id: string) => {
  return options.map((option) => {
    return {
      ...option,
      value: `${option.value}_${id}`,
    };
  });
};
