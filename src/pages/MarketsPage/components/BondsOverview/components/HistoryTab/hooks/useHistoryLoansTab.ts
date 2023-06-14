import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';

import { useRBOptionState } from '@frakt/components/RadioButton';
import { useIntersection } from '@frakt/hooks/useIntersection';
import { useScrollPagination } from '@frakt/hooks';
import { Bond } from '@frakt/api/bonds';

import { useFetchBondsHistory, useHistoryBondsSort } from './hooks';
import { HISTORY_FILTER_OPTIONS as options } from '../constants';

export const useHistoryLoansTab = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const { connected } = useWallet();

  const { ref, inView } = useIntersection();
  const [showOwnerBonds, setShowOwnerBonds] = useState<boolean>(false);
  const [selectedFilterOption, onChangeFilterOption] = useRBOptionState<string>(
    options[0].value,
  );

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
    eventType: selectedFilterOption,
    marketPubkey,
  });

  useScrollPagination<Bond>({
    selector: '.ant-table-content',
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
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
  const shouldShowConnectSection = !connected && showOwnerBonds;
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
    shouldShowConnectSection,
    shouldShowHistoryTable,
  };
};
