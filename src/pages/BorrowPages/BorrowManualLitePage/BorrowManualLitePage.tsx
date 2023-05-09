import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { groupBy, map } from 'lodash';
import classNames from 'classnames';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import InfinityScroll from '@frakt/components/InfinityScroll';
import { useDebounce } from '@frakt/hooks';
import {
  BorrowNft,
  LoanDuration,
  fetchBulkSuggestionMinimized,
} from '@frakt/api/nft';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { LoanType } from '@frakt/api/loans';
import { Tabs, useTabs } from '@frakt/components/Tabs';

import { Filters } from './components/Filters';
import { useMaxBorrow, useWalletNfts } from './hooks';
import { NftCard } from './components/NftCard';
import styles from './BorrowManualLitePage.module.scss';
import { Sidebar } from './components/Sidebar';
import { CartOrder, calcTotalBorrowValue, useBorrow } from '../cartState';
import { patchPairByBondOrders } from '../cartState/useCartState';
import { SuggestionPicker } from './components/SuggestionPicker';
import { DURATION_TABS } from './constants';

const useBorrowManualLitePage = () => {
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

  const isNotEnoughBalanceError =
    parseFloat(borrowValue) > parseFloat(maxBorrowValue.toFixed(2));

  return {
    wallet,
    isNotEnoughBalanceError,

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
  const {
    wallet,
    isNotEnoughBalanceError,

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
  } = useBorrowManualLitePage();

  const {
    nfts,
    fetchNextPage,
    initialLoading,
    setSearch,
    setSortName,
    setSortOrder,
  } = useWalletNfts({ duration: duration as LoanDuration });

  const setSearchDebounced = useDebounce((value: string) => {
    setSearch(value);
  }, 300);

  return (
    <AppLayout>
      {wallet.connected && !maxBorrowValueLoading && (
        <SuggestionPicker
          style={{
            width: 300,
            backgroundColor: 'white',
          }}
          value={borrowValue}
          percentValue={borrowPercentValue}
          onValueChange={onBorrowValueChange}
          onPercentChange={onBorrowPercentChange}
          maxValue={maxBorrowValue}
          isNotEnoughBalanceError={isNotEnoughBalanceError}
          onAfterChange={() => {
            if (isSuggestionRequested) {
              fetchSuggestion({ cancelRefetch: true });
            }
            setIsSuggestionRequested(true);
          }}
        />
      )}

      <Tabs
        tabs={durationTabs}
        value={duration}
        setValue={onDurationTabClick}
      />

      {!!currentNft && <Sidebar duration={duration as LoanDuration} />}
      <div
        className={classNames([
          styles.content,
          { [styles.contentSidebarVisible]: !!currentNft },
        ])}
      >
        <Filters
          setSearch={setSearchDebounced}
          onSortChange={({ name, order }) => {
            setSortName(name);
            setSortOrder(order);
          }}
        />
        <InfinityScroll
          itemsToShow={nfts.length}
          next={fetchNextPage}
          wrapperClassName={styles.nftsList}
          isLoading={initialLoading}
          customLoader={<p className={styles.loader}>loading your jpegs</p>}
        >
          {nfts.map((nft) => (
            <NftCard
              key={nft.mint}
              nft={nft}
              onClick={() => onNftClick(nft)}
              selected={
                !!findOrderInCart({ nftMint: nft.mint }) ||
                currentNft?.mint === nft.mint
              }
              highlighted={currentNft?.mint === nft.mint}
              disabled={
                nft?.classicParams?.isLimitExceeded &&
                !nft?.bondParams?.marketPubkey
              }
            />
          ))}
        </InfinityScroll>
      </div>
    </AppLayout>
  );
};
