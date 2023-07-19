import { useCallback, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { filter, includes, reduce } from 'lodash';
import { web3 } from 'fbonds-core';

import { LoanType } from '@frakt/api/loans';
import {
  BorrowNft,
  LoanDuration,
  MaxBorrow,
  fetchMaxBorrowValuePro,
  fetchWalletBorrowNftsLite,
} from '@frakt/api/nft';
import { useTabs } from '@frakt/components/Tabs';
import { PATHS } from '@frakt/constants';

import { useSearchWithFakeInfiniteScroll } from './useSearchWithFakeInfiniteScroll';
import { calcPriceBasedMaxLoanValue } from '../../cartState';
import { getUniqCollectionsWithCountNFTs } from '../helpers';
import { useCartStateLite } from '../cartStateLite';
import { DURATION_TABS } from '../constants';
import styles from '../BorrowManualLitePage.module.scss';

export const useBorrowManualLitePage = () => {
  const wallet = useWallet();
  const history = useHistory();

  const { maxBorrow, isLoading: maxBorrowValueLoading } = useMaxBorrow({
    walletPublicKey: wallet?.publicKey,
  });

  const goToProBorrowing = () => history.push(PATHS.BORROW_ROOT);

  const {
    tabs: durationTabs,
    value: duration,
    setValue: setDuration,
  } = useTabs({ tabs: DURATION_TABS, defaultValue: DURATION_TABS[0].value });

  const onDurationTabClick = (value: string) => {
    onBorrowValueChange('0');
    setDuration(value);
    clearCart();
  };

  const maxBorrowValue = useMemo(() => {
    return maxBorrow ? maxBorrow[duration] : 0;
  }, [maxBorrow, duration]);

  const {
    addNft,
    removeNft,
    clearCart,
    findNftInCart,
    getNftsCountByMarket,
    nfts: cartNfts,
    orderParamsByMint,
    selectNextCurrentNft,
    currentNft,
  } = useCartStateLite();

  const { isLoading, nfts, orders, resetCache } = useWalletNftsLite({
    duration: duration as LoanDuration,
  });

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

  const loanType = useMemo(() => {
    return duration === '0' ? LoanType.PRICE_BASED : LoanType.BOND;
  }, [duration]);

  const onNftClick = useCallback(
    (nft: BorrowNft) => {
      const isNftSelected = !!findNftInCart({ nftMint: nft.mint });

      if (isNftSelected) {
        return removeNft({
          nftMint: nft.mint,
          loanType,
        });
      }

      if (loanType === LoanType.PRICE_BASED) {
        addNft({
          nft,
          loanType,
          orderParams: null,
        });
      }

      if (loanType === LoanType.BOND) {
        const sameCollectionInCartCount = getNftsCountByMarket({
          marketPubkey: nft.bondParams.marketPubkey,
        });

        const orderParams =
          orders[nft.bondParams.marketPubkey]?.[sameCollectionInCartCount];

        if (!orderParams || orderParams.loanValue <= 0) return;

        addNft({
          nft,
          loanType,
          orderParams:
            orders[nft.bondParams.marketPubkey][sameCollectionInCartCount],
        });
      }
    },
    [loanType, addNft, findNftInCart, getNftsCountByMarket, orders, removeNft],
  );

  const getCurrentNftOrderParams = useCallback(() => {
    return orderParamsByMint?.[currentNft?.mint] ?? null;
  }, [currentNft, orderParamsByMint]);

  const getBondFee = useCallback(
    (nft: BorrowNft) => {
      if (loanType === LoanType.PRICE_BASED) return null;

      if (findNftInCart({ nftMint: nft.mint })) {
        return orderParamsByMint[nft.mint].loanFee;
      }

      const marketPubkey = nft.bondParams.marketPubkey;

      const sameCollectionAmount = getNftsCountByMarket({
        marketPubkey: nft.bondParams.marketPubkey,
      });

      return orders[marketPubkey]?.[sameCollectionAmount]?.loanFee ?? 0;
    },
    [findNftInCart, getNftsCountByMarket, loanType, orderParamsByMint, orders],
  );

  const getBondLoanValue = useCallback(
    (nft: BorrowNft) => {
      if (loanType === LoanType.PRICE_BASED) return null;

      if (findNftInCart({ nftMint: nft.mint })) {
        return orderParamsByMint[nft.mint].loanValue;
      }

      const marketPubkey = nft.bondParams.marketPubkey;

      const sameCollectionAmount = getNftsCountByMarket({
        marketPubkey: nft.bondParams.marketPubkey,
      });

      return orders[marketPubkey]?.[sameCollectionAmount]?.loanValue ?? 0;
    },
    [findNftInCart, getNftsCountByMarket, loanType, orderParamsByMint, orders],
  );

  const totalBorrowValue = useMemo(() => {
    if (!cartNfts.length) return 0;

    return reduce(
      cartNfts,
      (borrowValue, nft) => {
        return (
          borrowValue +
          (loanType === LoanType.BOND
            ? orderParamsByMint[nft.mint].loanValue
            : calcPriceBasedMaxLoanValue({ nft }))
        );
      },
      0,
    );
  }, [cartNfts, orderParamsByMint, loanType]);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const filteredNFTsByCollectionName = useMemo(() => {
    if (selectedOptions.length) {
      return filter(nfts, (nft) =>
        includes(selectedOptions, nft.collectionName),
      );
    }
    return nfts;
  }, [nfts, selectedOptions]);

  const sortedByCountNFTs = filteredNFTsByCollectionName.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const {
    data: searchedNfts,
    setSearch,
    fetchMoreTrigger,
  } = useSearchWithFakeInfiniteScroll({
    itemsPerScroll: 50,
    rawData: sortedByCountNFTs,
    searchFunc: ({ name }, search) =>
      name.toUpperCase().includes(search.toUpperCase()),
    enabled: !!nfts.length,
  });

  return {
    wallet,
    maxBorrowValueLoading,
    maxBorrowValue,
    borrowValue,

    borrowPercentValue,
    onBorrowValueChange,
    onBorrowPercentChange,

    durationTabs,
    duration,
    onDurationTabClick,

    nfts: searchedNfts,
    maxNfts: nfts?.length || 0,
    onNftClick,
    findNftInCart,
    orders,
    currentNft,
    getCurrentNftOrderParams,
    loanType,

    cartNfts,
    orderParamsByMint,

    isBulk: cartNfts.length > 1,
    totalBorrowValue,
    clearCart,
    getBondFee,
    getBondLoanValue,

    dataLoading: isLoading || maxBorrowValueLoading,
    selectNextCurrentNft,
    setSearch,
    resetCache,
    fetchMoreTrigger,

    goToProBorrowing,

    searchSelectParams: {
      options: getUniqCollectionsWithCountNFTs(nfts),
      placeholder: 'Select a collection',
      optionKeys: {
        labelKey: 'collectionName',
        valueKey: 'collectionName',
        imageKey: 'collectionImage',
        secondLabelKey: { key: 'nftsCount' },
      },
      selectedOptions,
      labels: ['Collections', 'Nfts'],
      onFilterChange: setSelectedOptions,
      collapsedWidth: !!currentNft && 1280,
      className: !!currentNft && styles.searchSelect,
    },
  };
};

type UseMaxBorrow = (props: { walletPublicKey?: web3.PublicKey }) => {
  maxBorrow: MaxBorrow;
  isLoading: boolean;
};
export const useMaxBorrow: UseMaxBorrow = ({ walletPublicKey }) => {
  const { data, isLoading } = useQuery(
    ['maxBorrow', walletPublicKey?.toBase58()],
    () =>
      fetchMaxBorrowValuePro({
        publicKey: walletPublicKey,
      }),
    {
      enabled: !!walletPublicKey,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    maxBorrow: data,
    isLoading,
  };
};

export const useWalletNftsLite = ({
  duration = '7',
}: {
  duration?: LoanDuration;
}) => {
  const wallet = useWallet();

  const {
    data,
    isLoading,
    remove: resetCache,
  } = useQuery(
    ['walletNftsLite', wallet?.publicKey?.toBase58(), duration],
    () =>
      fetchWalletBorrowNftsLite({
        publicKey: wallet.publicKey,
        duration,
      }),
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      enabled: wallet.connected,
    },
  );

  return {
    nfts: data?.nfts ?? [],
    orders: data?.orders ?? {},
    isLoading,
    resetCache,
  };
};
