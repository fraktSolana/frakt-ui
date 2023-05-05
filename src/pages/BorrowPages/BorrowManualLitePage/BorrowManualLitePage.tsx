import { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
import { Tab, Tabs, useTabs } from '@frakt/components/Tabs';

import { Filters } from './components/Filters';
import { useMaxBorrow, useWalletNfts } from './hooks';
import { NftCard } from './components/NftCard';
import styles from './BorrowManualLitePage.module.scss';
import { Sidebar } from './components/Sidebar';
import { CartOrder, useBorrow } from '../cartState';
import { BulkForm } from './components/BulkForm';

export const BorrowManualLitePage: FC = () => {
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
    cartOrders,
    onSelectNft,
    // isBulk,
    currentNft,
    findOrderInCart,
    onRemoveNft,
    clearCart,
    clearCurrentNftState,
    setCartState,
    setCurrentNftFromOrder,
    totalBorrowValue,
  } = useBorrow();

  const [suggestionRequested, setSuggestionRequested] =
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

  //TODO: Fix leak
  // useEffect(() => {
  //   totalBorrowValue &&
  //     onBorrowValueChange((totalBorrowValue / 1e9).toFixed(2));
  // }, [totalBorrowValue, onBorrowValueChange]);

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

  const onNftClick = (nft: BorrowNft) => {
    const isNftSelected =
      !!findOrderInCart({ nftMint: nft.mint }) || currentNft?.mint === nft.mint;

    if (isNftSelected) {
      return onRemoveNft(nft);
    }

    onSelectNft(nft);
  };

  const { isLoading: suggestionLoading, refetch: fetchSuggestion } = useQuery(
    ['bulkSuggestion', borrowValue, duration],
    () =>
      fetchBulkSuggestionMinimized({
        publicKey: wallet.publicKey,
        totalValue: borrowValue,
        duration: duration as LoanDuration,
      }),
    {
      enabled: false,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      onSuccess: (suggestion) => {
        if (!suggestion) return;
        clearCart();
        clearCurrentNftState();
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

        setCartState({
          orders: cartOrders,
          pairs: suggestion?.modifiedPairs,
        });
      },
    },
  );

  const debouncedRefetch = useDebounce(() => {
    setSuggestionRequested(true);
    fetchSuggestion();
  }, 300);

  useEffect(() => {
    if (parseFloat(borrowValue)) {
      debouncedRefetch();
    }
  }, [borrowValue, debouncedRefetch]);

  useEffect(() => {
    if (suggestionRequested && cartOrders.length && !suggestionLoading) {
      setCurrentNftFromOrder(cartOrders[0]?.borrowNft?.mint);
      setSuggestionRequested(false);
    }
  }, [
    cartOrders,
    suggestionRequested,
    setCurrentNftFromOrder,
    suggestionLoading,
  ]);

  const isNotEnoughBalanceError =
    parseFloat(borrowValue) > parseFloat(maxBorrowValue.toFixed(2));

  return (
    <AppLayout>
      {wallet.connected && !maxBorrowValueLoading && (
        <BulkForm
          borrowValue={borrowValue}
          borrowPercentValue={borrowPercentValue}
          onBorrowValueChange={onBorrowValueChange}
          onBorrowPercentChange={onBorrowPercentChange}
          maxBorrowValue={maxBorrowValue}
          isNotEnoughBalanceError={isNotEnoughBalanceError}
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

const DURATION_TABS: Tab[] = [
  {
    label: '7 days',
    value: '7',
  },
  {
    label: '14 days',
    value: '14',
  },
  {
    label: 'Perpetual',
    value: '0',
  },
];
