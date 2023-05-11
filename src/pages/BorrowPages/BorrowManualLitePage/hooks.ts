import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import { Dictionary } from 'lodash';
import { web3 } from 'fbonds-core';
import produce from 'immer';

import {
  BorrowNft,
  LoanDuration,
  MaxBorrow,
  OrderParamsLite,
  fetchMaxBorrowValuePro,
  fetchWalletBorrowNftsLite,
} from '@frakt/api/nft';
import { LoanType } from '@frakt/api/loans';

interface CartStateLite {
  nfts: BorrowNft[];
  orderParamsByMint: Dictionary<OrderParamsLite>; //? Collection by mint
  addNft: (props: {
    nft: BorrowNft;
    orderParams?: OrderParamsLite;
    loanType: LoanType;
  }) => void;
  removeNft: (props: { nftMint: string; loanType: LoanType }) => void;
  findNftInCart: (props: { nftMint: string }) => BorrowNft | null;
  getNftsCountByMarket: (props: { marketPubkey: string }) => number;
  clearCart: () => void;
}

export const useCartStateLite = create<CartStateLite>((set, get) => ({
  nfts: [],
  orderParamsByMint: {},
  findNftInCart: ({ nftMint }) => {
    return get().nfts.find(({ mint }) => mint === nftMint) ?? null;
  },
  getNftsCountByMarket: ({ marketPubkey }) => {
    return (
      get().nfts.filter(
        ({ bondParams }) => bondParams?.marketPubkey === marketPubkey,
      )?.length || 0
    );
  },
  addNft: ({ nft, orderParams, loanType }) => {
    if (get().findNftInCart({ nftMint: nft.mint })) return;

    set(
      produce((state: CartStateLite) => {
        state.nfts = [...state.nfts, nft];
        if (loanType === LoanType.BOND) {
          state.orderParamsByMint = {
            ...state.orderParamsByMint,
            [nft.mint]: orderParams,
          };
        }
      }),
    );
  },
  removeNft: ({ nftMint, loanType }) => {
    set(
      produce((state: CartStateLite) => {
        const nftToRemove = state.findNftInCart({ nftMint });

        if (!nftToRemove) return;

        state.nfts = state.nfts.filter(({ mint }) => mint !== nftMint);

        if (loanType === LoanType.BOND) {
          const removableOrderParam = state.orderParamsByMint[nftMint];

          const firstLowerLoanValueNft =
            state.nfts.find(({ mint }) => {
              const loanValue = state.orderParamsByMint[mint].loanValue;
              return loanValue < removableOrderParam.loanValue;
            }) ?? null;

          if (firstLowerLoanValueNft) {
            state.orderParamsByMint[firstLowerLoanValueNft.mint] =
              removableOrderParam;
          }

          delete state.orderParamsByMint[nftMint];
        }
      }),
    );
  },
  clearCart: () =>
    set(
      produce((state: CartStateLite) => {
        state.nfts = [];
        state.orderParamsByMint = {};
      }),
    ),
}));

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
