import {
  WalletContextState,
  useWallet,
  useConnection,
} from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';
import { useQuery } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { orderBy } from 'lodash';
import { borrow } from 'fbonds-core/lib/fbond-protocol/functions/bond/creation';

import { fetchMarketPairs, fetchCertainMarket } from '@frakt/api/bonds';
import {
  BorrowNft,
  fetchWalletBorrowNfts,
  BondCartOrder,
} from '@frakt/api/nft';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { useDebounce } from '@frakt/hooks';
import { captureSentryError } from '@frakt/utils/sentry';
import { NFT } from '@frakt/pages/DashboardPage/types';
import { notify, throwLogsError } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { PATHS } from '@frakt/constants';
import { showSolscanLinkNotification } from '@frakt/utils/transactions';
import {
  useVisibleMarketURLControl,
  useSearchSelectedMarketsURLControl,
} from '@frakt/hooks';

import { useNotConnectedBorrowContent } from '../../NotConnectedBorrowContent';
import { filterPairs, getBondOrderParams, parseNFTs } from '../helpers';
import { useDashboardWalletNfts } from './useDashboardWalletNfts';

export const useConnectedBorrowContent = () => {
  const { nfts, fetchNextPage, initialLoading, setSearch, hideNFT } =
    useDashboardWalletNfts();

  const { collections, setSearch: setSearchCollections } =
    useNotConnectedBorrowContent();

  const setSearchDebounced = useDebounce((value: string) => {
    setSearch(value);
  }, 300);

  const parsedNFTs = parseNFTs(nfts);

  const sortedNFTsByLoanValue = orderBy(
    parsedNFTs,
    ({ maxLoanValue }) => maxLoanValue,
    'desc',
  );

  //? used for prevent bugs with changeable content when searching nfts
  const { data: userNFTs, loading: loadingUserNFTs } =
    useFetchWalletNFTsWithoutSearchParams();

  const userHasNFTs = !!userNFTs?.length && !loadingUserNFTs;

  return {
    nfts: nfts?.length || userHasNFTs ? sortedNFTsByLoanValue : collections,
    setSearch: userHasNFTs ? setSearchDebounced : setSearchCollections,
    loading: initialLoading,
    fetchNextPage,
    loadingUserNFTs,
    hideNFT,
  };
};

const useFetchWalletNFTsWithoutSearchParams = () => {
  const { publicKey: walletPublicKey } = useWallet();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: BorrowNft[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchWalletNFTsWithoutSearchParams', walletPublicKey],
    () => fetchWalletBorrowNfts({ publicKey: walletPublicKey, limit: 5 }),
    {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  );

  return { data, loading: isLoading || isFetching };
};

export const useBorrowSingleBond = () => {
  const { connection } = useConnection();
  const history = useHistory();
  const wallet = useWallet();

  const goToToBorrowSuccessPage = () => history.push(PATHS.BORROW_SUCCESS);

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const { setSelectedOptions } = useSearchSelectedMarketsURLControl();
  const { toggleVisibleCard } = useVisibleMarketURLControl();

  const goToLiteLending = (collectionName: string) => {
    setSelectedOptions([collectionName]);
    toggleVisibleCard(collectionName);

    history.push({
      pathname: PATHS.BONDS_LITE,
      search: `?opened=${collectionName}&collections=${collectionName}`,
    });
  };

  const onSubmit = async (nft: NFT, hideNFT: (nftMint: string) => void) => {
    if (!nft?.mint) {
      goToLiteLending(nft?.name);
    }

    try {
      openLoadingModal();

      const { market, pairs } = await fetchMarketAndPairs(
        nft?.marketPubkey,
        wallet?.publicKey,
      );

      if (!market) return;

      const bondOrderParams = getBondOrderParams({
        market,
        pairs,
        maxLoanValue: nft?.maxLoanValue,
      });

      const result = await borrowSingle({
        nft,
        bondOrderParams: bondOrderParams?.orderParams,
        wallet,
        connection,
      });

      if (!result) {
        throw new Error('Borrow failed');
      }
      hideNFT(nft?.mint);
      goToToBorrowSuccessPage();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    } finally {
      closeLoadingModal();
    }
  };

  return { onSubmit, loadingModalVisible, closeLoadingModal };
};

const fetchMarketAndPairs = async (
  marketPubkey: string,
  walletPubkey: web3.PublicKey,
) => {
  const marketWeb3Pubkey = new web3.PublicKey(marketPubkey);
  const [pairs, market] = await Promise.all([
    await fetchMarketPairs({ marketPubkey: marketWeb3Pubkey }),
    await fetchCertainMarket({ marketPubkey: marketWeb3Pubkey }),
  ]);

  const filteredPairs = filterPairs(pairs, walletPubkey);

  return { pairs: filteredPairs, market };
};

const borrowSingle = async ({
  nft,
  bondOrderParams,
  connection,
  wallet,
}: {
  nft: NFT;
  bondOrderParams: BondCartOrder[];
  connection: web3.Connection;
  wallet: WalletContextState;
}) => {
  const order = {
    borrowNft: {
      mint: nft.mint,
      bondParams: {
        marketPubkey: nft.marketPubkey,
        whitelistEntry: {
          publicKey: nft.whitelistEntryPubkey,
          fraktMarket: nft.fraktMarketPubkey,
        },
        oracleFloor: nft.oracleFloorPubkey,
      },
    },
    bondOrderParams: bondOrderParams.filter(
      (orderParam) => orderParam.orderSize > 0,
    ),
  };
  return await borrow({
    isTest: true,

    notBondTxns: [],
    orders: [order],
    connection,
    wallet,
    isLedger: false,
    skipPreflight: false,
    onAfterSend: () => {
      notify({
        message: 'Transactions sent!',
        type: NotifyType.INFO,
      });
    },
    onError: (error) => {
      throwLogsError(error);
      const isNotConfirmed = showSolscanLinkNotification(error);
      if (!isNotConfirmed) {
        notify({
          message: 'The transaction just failed :( Give it another try',
          type: NotifyType.ERROR,
        });
      }
      captureSentryError({
        error,
        wallet,
        transactionName: 'borrowSingleBond',
      });
    },
    onSuccess: () => {
      notify({
        message: 'Borrowed successfully!',
        type: NotifyType.SUCCESS,
      });
    },
  });
};
