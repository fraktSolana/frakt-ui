import { useCallback, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { web3 } from 'fbonds-core';
import { reduce } from 'lodash';

import { LoanType } from '@frakt/api/loans';
import {
  BorrowNft,
  LoanDuration,
  MaxBorrow,
  fetchMaxBorrowValuePro,
  fetchWalletBorrowNftsLite,
} from '@frakt/api/nft';
import { useTabs } from '@frakt/components/Tabs';

import { DURATION_TABS } from './constants';
import { useCartStateLite } from './cartStateLite';
import { calcPriceBasedMaxLoanValue } from '../cartState';

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
  } = useCartStateLite();

  const { isLoading, nfts, orders } = useWalletNftsLite({
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

  const currentNft = useMemo(() => {
    return cartNfts.at(-1) ?? null;
  }, [cartNfts]);

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

    nfts,
    onNftClick,
    findNftInCart,
    orders,
    currentNft,
    getCurrentNftOrderParams,
    loanType,

    cartNfts,
    orderParamsByMint,

    isBulk: nfts.length > 1,
    totalBorrowValue,
    clearCart,
    getBondFee,
    getBondLoanValue,

    dataLoading: isLoading || maxBorrowValueLoading,
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

  const { data, isLoading } = useQuery(
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
  };
};

// const FETCH_LIMIT = 15;

// export const useWalletNfts = ({
//   duration = '7',
//   queryData,
// }: {
//   duration?: LoanDuration;
//   queryData?: Sort;
// }) => {
//   const wallet = useWallet();

//   const [search, setSearch] = useState('');

//   const fetchData = async ({ pageParam }: { pageParam: number }) => {
//     const data = await fetchWalletBorrowNfts({
//       publicKey: wallet.publicKey,
//       limit: FETCH_LIMIT,
//       offset: pageParam * FETCH_LIMIT,
//       search,
//       sortBy: 'maxLoanValue',
//       sortOrder: 'desc',
//       duration,
//       loanType: duration === '0' ? LoanType.PRICE_BASED : LoanType.BOND,
//     });

//     return { pageParam, data };
//   };

//   const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
//     useInfiniteQuery({
//       queryKey: [
//         'walletNfts',
//         wallet?.publicKey?.toBase58(),
//         search,
//         duration,
//         queryData,
//       ],
//       queryFn: ({ pageParam = 0 }) => fetchData({ pageParam }),
//       getPreviousPageParam: (firstPage) => {
//         return firstPage.pageParam - 1 ?? undefined;
//       },
//       getNextPageParam: (lastPage) => {
//         return lastPage.data?.length ? lastPage.pageParam + 1 : undefined;
//       },
//       staleTime: 5 * 60 * 1000,
//       refetchOnWindowFocus: false,
//       enabled: wallet.connected,
//     });

//   return {
//     nfts: data?.pages?.map((page) => page.data).flat() || [],
//     initialLoading: isLoading,
//     fetchNextPage,
//     isFetchingNextPage,
//     hasNextPage,
//     search,
//     setSearch,
//   };
// };

// export const useBorrowManualLitePageOld = () => {
//   const wallet = useWallet();
//   const { maxBorrow, isLoading: maxBorrowValueLoading } = useMaxBorrow({
//     walletPublicKey: wallet?.publicKey,
//   });

//   const {
//     tabs: durationTabs,
//     value: duration,
//     setValue: setDuration,
//   } = useTabs({ tabs: DURATION_TABS, defaultValue: DURATION_TABS[0].value });

//   const onDurationTabClick = (value: string) => {
//     onBorrowValueChange('0');
//     setDuration(value);
//     clearCurrentNftState();
//     clearCart();
//   };

//   const maxBorrowValue = useMemo(() => {
//     return maxBorrow ? maxBorrow[duration] : 0;
//   }, [maxBorrow, duration]);

//   const {
//     onSelectNft,
//     currentNft,
//     currentLoanValue,
//     findOrderInCart,
//     onRemoveNft,
//     clearCart,
//     clearCurrentNftState,
//     setCartState,
//     totalBorrowValue,
//     setCurrentNftState,
//   } = useBorrow();

//   const [isSuggestionRequested, setIsSuggestionRequested] =
//     useState<boolean>(false);

//   const [borrowValue, setBorrowValue] = useState<string>('');
//   const [borrowPercentValue, setBorrowPercentValue] = useState<number>(0);

//   const onBorrowPercentChange = useCallback(
//     (nextValue: number) => {
//       const depositValue =
//         ((nextValue * maxBorrowValue) / 100)?.toFixed(2) || '0';
//       setBorrowValue(depositValue);
//       setBorrowPercentValue(nextValue);
//     },
//     [maxBorrowValue],
//   );

//   const onBorrowValueChange = useCallback(
//     (nextValue: string) => {
//       setBorrowValue(nextValue);

//       const balancePercent = (parseFloat(nextValue) / maxBorrowValue) * 100;

//       if (balancePercent > 100) {
//         return setBorrowPercentValue(100);
//       }
//       if (balancePercent < 0) {
//         return setBorrowPercentValue(0);
//       }

//       return setBorrowPercentValue(balancePercent);
//     },
//     [maxBorrowValue],
//   );

//   const onNftClick = (nft: BorrowNft) => {
//     const isNftSelected =
//       !!findOrderInCart({ nftMint: nft.mint }) || currentNft?.mint === nft.mint;

//     if (isNftSelected) {
//       return onRemoveNft(nft);
//     }

//     onSelectNft(nft);
//   };

//   const { isFetching: suggestionFetching, refetch: fetchSuggestion } = useQuery(
//     ['bulkSuggestion', borrowValue, duration],
//     () => {
//       return fetchBulkSuggestionMinimized({
//         publicKey: wallet.publicKey,
//         totalValue: borrowValue,
//         duration: duration as LoanDuration,
//       });
//     },
//     {
//       enabled: false,
//       staleTime: 5 * 60 * 1000,
//       refetchOnWindowFocus: false,
//       onSuccess: (suggestion) => {
//         if (!suggestion) return;
//         clearCurrentNftState();
//         clearCart();
//         const cartOrders: CartOrder[] = suggestion.orders.map((order) => ({
//           borrowNft: order.borrowNft,
//           loanType: order.loanType,
//           loanValue: order.loanValue,
//           bondOrderParams:
//             order.loanType === LoanType.BOND
//               ? {
//                   market: suggestion.markets.find(
//                     ({ marketPubkey }) =>
//                       marketPubkey ===
//                       order?.borrowNft?.bondParams?.marketPubkey,
//                   ),
//                   orderParams: order.bondOrderParams,
//                 }
//               : null,
//         }));

//         const totalBorrowVlaue = calcTotalBorrowValue({ cartOrders });
//         onBorrowValueChange((totalBorrowVlaue / 1e9).toFixed(2));

//         const currentOrder = cartOrders[0];
//         if (!currentOrder) return;

//         setCurrentNftState({
//           nft: currentOrder.borrowNft,
//           loanType: currentOrder.loanType,
//           loanValue: currentOrder.loanValue,
//           bondOrderParams: currentOrder.bondOrderParams,
//         });

//         if (currentOrder.loanType !== LoanType.BOND) {
//           setCartState({
//             orders: cartOrders.filter(
//               ({ borrowNft }) => borrowNft.mint !== currentOrder.borrowNft.mint,
//             ),
//             pairs: suggestion?.modifiedPairs,
//           });
//         } else {
//           const { orderParams: bondOrders } = currentOrder.bondOrderParams;

//           const bondOrdersByPair = groupBy(
//             bondOrders,
//             ({ pairPubkey }) => pairPubkey,
//           );

//           const affectedPairs = suggestion?.modifiedPairs.filter(
//             ({ publicKey }) =>
//               Object.keys(bondOrdersByPair).includes(publicKey),
//           );

//           const patchedPairs = map(affectedPairs, (pair) =>
//             patchPairByBondOrders({
//               pair,
//               bondOrders: bondOrdersByPair[pair.publicKey],
//               reverse: true,
//             }),
//           );

//           setCartState({
//             orders: cartOrders.filter(
//               ({ borrowNft }) => borrowNft.mint !== currentOrder.borrowNft.mint,
//             ),
//             pairs: patchedPairs,
//           });
//         }

//         setIsSuggestionRequested(false);
//       },
//     },
//   );

//   useEffect(() => {
//     !isSuggestionRequested &&
//       !suggestionFetching &&
//       onBorrowValueChange((totalBorrowValue / 1e9).toFixed(2));
//   }, [
//     totalBorrowValue,
//     currentLoanValue,
//     onBorrowValueChange,
//     isSuggestionRequested,
//     suggestionFetching,
//   ]);

//   useEffect(() => {
//     if (isSuggestionRequested) {
//       fetchSuggestion();
//     }
//   }, [isSuggestionRequested, fetchSuggestion, clearCart, clearCurrentNftState]);

//   useEffect(() => {
//     onBorrowValueChange((totalBorrowValue / 1e9).toFixed(2));
//   }, [totalBorrowValue, onBorrowValueChange]);

//   return {
//     wallet,

//     maxBorrowValueLoading,
//     maxBorrowValue,
//     borrowValue,

//     borrowPercentValue,
//     onBorrowValueChange,
//     onBorrowPercentChange,

//     isSuggestionRequested,
//     fetchSuggestion,
//     setIsSuggestionRequested,

//     durationTabs,
//     duration,
//     onDurationTabClick,

//     currentNft,
//     onNftClick,
//     findOrderInCart,
//   };
// };
