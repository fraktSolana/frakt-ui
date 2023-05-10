import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { groupBy, map } from 'lodash';
import classNames from 'classnames';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import {
  BorrowNft,
  LoanDuration,
  fetchBulkSuggestionMinimized,
} from '@frakt/api/nft';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { LoanType } from '@frakt/api/loans';
import { Tabs, useTabs } from '@frakt/components/Tabs';
import { Loader } from '@frakt/components/Loader';
import { useIntersection } from '@frakt/hooks/useIntersection';
import { Sort } from '@frakt/components/Table';

import { useMaxBorrow, useWalletNfts } from './hooks';
import { Sidebar } from './components/Sidebar';
import { CartOrder, calcTotalBorrowValue, useBorrow } from '../cartState';
import { patchPairByBondOrders } from '../cartState/useCartState';
import { DURATION_TABS } from './constants';
import { BorrowManualTable } from './components/BorrowManualTable';
import styles from './BorrowManualLitePage.module.scss';

export const useBorrowManualLitePage = () => {
  const wallet = useWallet();
  const { maxBorrow, isLoading: maxBorrowValueLoading } = useMaxBorrow({
    walletPublicKey: wallet?.publicKey,
  });

  const {
    tabs: durationTabs,
    value: duration,
    setValue: setDuration,
  } = useTabs({ tabs: DURATION_TABS, defaultValue: DURATION_TABS[0].value });

  const onDurationTabClick = (value: string) => {
    onBorrowValueChange('0');
    setDuration(value);
    clearCart();
    clearCurrentNftState();
  };

  const maxBorrowValue = useMemo(() => {
    return maxBorrow ? maxBorrow[duration] : 0;
  }, [maxBorrow, duration]);

  const {
    onSelectNft,
    currentNft,
    currentLoanValue,
    findOrderInCart,
    onRemoveNft,
    clearCart,
    clearCurrentNftState,
    setCartState,
    totalBorrowValue,
    setCurrentNftState,
  } = useBorrow();

  const [isSuggestionRequested, setIsSuggestionRequested] =
    useState<boolean>(false);

  const [borrowValue, setBorrowValue] = useState<string>('');
  const [borrowPercentValue, setBorrowPercentValue] = useState<number>(0);

  const onBorrowPercentChange = useCallback(
    (nextValue: number) => {
      const depositValue =
        ((nextValue * maxBorrowValue) / 100)?.toFixed(2) || '0';
      setBorrowValue(depositValue);
      setBorrowPercentValue(nextValue);
    },
    [maxBorrowValue],
  );

  const onBorrowValueChange = useCallback(
    (nextValue: string) => {
      setBorrowValue(nextValue);

      const balancePercent = (parseFloat(nextValue) / maxBorrowValue) * 100;

      if (balancePercent > 100) {
        return setBorrowPercentValue(100);
      }
      if (balancePercent < 0) {
        return setBorrowPercentValue(0);
      }

      return setBorrowPercentValue(balancePercent);
    },
    [maxBorrowValue],
  );

  const onNftClick = (nft: BorrowNft) => {
    const isNftSelected =
      !!findOrderInCart({ nftMint: nft.mint }) || currentNft?.mint === nft.mint;

    if (isNftSelected) {
      return onRemoveNft(nft);
    }

    onSelectNft(nft);
  };

  const { isFetching: suggestionFetching, refetch: fetchSuggestion } = useQuery(
    ['bulkSuggestion', borrowValue, duration],
    () => {
      return fetchBulkSuggestionMinimized({
        publicKey: wallet.publicKey,
        totalValue: borrowValue,
        duration: duration as LoanDuration,
      });
    },
    {
      enabled: false,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      onSuccess: (suggestion) => {
        if (!suggestion) return;
        clearCurrentNftState();
        clearCart();
        const cartOrders: CartOrder[] = suggestion.orders.map((order) => ({
          borrowNft: order.borrowNft,
          loanType: order.loanType,
          loanValue: order.loanValue,
          bondOrderParams:
            order.loanType === LoanType.BOND
              ? {
                  market: suggestion.markets.find(
                    ({ marketPubkey }) =>
                      marketPubkey ===
                      order?.borrowNft?.bondParams?.marketPubkey,
                  ),
                  orderParams: order.bondOrderParams,
                }
              : null,
        }));

        const totalBorrowVlaue = calcTotalBorrowValue({ cartOrders });
        onBorrowValueChange((totalBorrowVlaue / 1e9).toFixed(2));

        const currentOrder = cartOrders[0];
        if (!currentOrder) return;

        setCurrentNftState({
          nft: currentOrder.borrowNft,
          loanType: currentOrder.loanType,
          loanValue: currentOrder.loanValue,
          bondOrderParams: currentOrder.bondOrderParams,
        });

        if (currentOrder.loanType !== LoanType.BOND) {
          setCartState({
            orders: cartOrders.filter(
              ({ borrowNft }) => borrowNft.mint !== currentOrder.borrowNft.mint,
            ),
            pairs: suggestion?.modifiedPairs,
          });
        } else {
          const { orderParams: bondOrders } = currentOrder.bondOrderParams;

          const bondOrdersByPair = groupBy(
            bondOrders,
            ({ pairPubkey }) => pairPubkey,
          );

          const affectedPairs = suggestion?.modifiedPairs.filter(
            ({ publicKey }) =>
              Object.keys(bondOrdersByPair).includes(publicKey),
          );

          const patchedPairs = map(affectedPairs, (pair) =>
            patchPairByBondOrders({
              pair,
              bondOrders: bondOrdersByPair[pair.publicKey],
              reverse: true,
            }),
          );

          setCartState({
            orders: cartOrders.filter(
              ({ borrowNft }) => borrowNft.mint !== currentOrder.borrowNft.mint,
            ),
            pairs: patchedPairs,
          });
        }

        setIsSuggestionRequested(false);
      },
    },
  );

  useEffect(() => {
    !isSuggestionRequested &&
      !suggestionFetching &&
      onBorrowValueChange((totalBorrowValue / 1e9).toFixed(2));
  }, [
    totalBorrowValue,
    currentLoanValue,
    onBorrowValueChange,
    isSuggestionRequested,
    suggestionFetching,
  ]);

  useEffect(() => {
    if (isSuggestionRequested) {
      fetchSuggestion();
    }
  }, [isSuggestionRequested, fetchSuggestion, clearCart, clearCurrentNftState]);

  useEffect(() => {
    onBorrowValueChange((totalBorrowValue / 1e9).toFixed(2));
  }, [totalBorrowValue, onBorrowValueChange]);

  return {
    wallet,

    maxBorrowValueLoading,
    maxBorrowValue,
    borrowValue,

    borrowPercentValue,
    onBorrowValueChange,
    onBorrowPercentChange,

    isSuggestionRequested,
    fetchSuggestion,
    setIsSuggestionRequested,

    durationTabs,
    duration,
    onDurationTabClick,

    currentNft,
    onNftClick,
    findOrderInCart,
  };
};

export const BorrowManualLitePage: FC = () => {
  const { ref, inView } = useIntersection();

  const {
    wallet,

    maxBorrowValueLoading,

    durationTabs,
    duration,
    onDurationTabClick,

    findOrderInCart,

    currentNft,
    onNftClick,
  } = useBorrowManualLitePage();

  const [queryData, setQueryData] = useState<Sort>(null);

  const {
    nfts,
    initialLoading,
    fetchNextPage,
    isFetchingNextPage,
    setSearch,
    hasNextPage,
  } = useWalletNfts({
    duration: duration as LoanDuration,
    queryData,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <AppLayout>
      <div className={styles.container}>
        {wallet.connected && !maxBorrowValueLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              columnGap: 20,
            }}
          >
            <Tabs
              tabs={durationTabs}
              value={duration}
              setValue={onDurationTabClick}
              className={styles.tabs}
              additionalClassNames={{
                tabClassName: styles.tab,
                tabActiveClassName: styles.tabActive,
              }}
              type="unset"
            />
          </div>
        )}

        {!!currentNft && <Sidebar duration={duration as LoanDuration} />}
        <div
          className={classNames([
            styles.content,
            { [styles.contentSidebarVisible]: !!currentNft },
          ])}
        >
          <>
            <BorrowManualTable
              data={nfts.map((nft) => ({
                nft,
                active: currentNft?.mint === nft.mint,
                selected:
                  currentNft?.mint === nft.mint ||
                  !!findOrderInCart({ nftMint: nft.mint }),
                bondFee: 0, //TODO: Get from bond combinations
                bondLoanValue: 0, //TODO: Get from bond combinations
              }))}
              duration={duration as LoanDuration}
              setQuerySearch={setSearch}
              setQueryData={setQueryData}
              onRowClick={(nft) => onNftClick(nft?.nft)}
            />
            {isFetchingNextPage && <Loader />}
            <div ref={ref} />
          </>

          {!nfts?.length && initialLoading && <Loader />}
        </div>
      </div>
    </AppLayout>
  );
};
