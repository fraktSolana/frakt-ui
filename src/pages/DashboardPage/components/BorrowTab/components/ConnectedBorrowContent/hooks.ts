import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';
import { useQuery } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';

import { useFetchAllLoans } from '@frakt/pages/LoansPage/components/LoansActiveTab/hooks';
import { useWalletNfts } from '@frakt/pages/BorrowPages/BorrowManualPage/hooks';
import { makeCreateBondMultiOrdersTransaction } from '@frakt/utils/bonds';
import { fetchMarketPairs, fetchCertainMarket } from '@frakt/api/bonds';
import { BorrowNft, fetchWalletBorrowNfts } from '@frakt/api/nft';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { useConnection, useDebounce } from '@frakt/hooks';
import { captureSentryError } from '@frakt/utils/sentry';
import { NFT } from '@frakt/pages/DashboardPage/types';
import { notify, throwLogsError } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { PATHS } from '@frakt/constants';
import {
  showSolscanLinkNotification,
  signAndSendV0TransactionWithLookupTables,
} from '@frakt/utils/transactions';

import { useNotConnectedBorrowContent } from '../NotConnectedBorrowContent';
import { filterPairs, getBondOrderParams, parseNFTs } from './helpers';

export const useConnectedBorrowContent = () => {
  const { collections, setSearch: setSearchCollections } =
    useNotConnectedBorrowContent();

  const { nfts, fetchNextPage, initialLoading, setSearch } = useWalletNfts();

  //! used for prevent bugs with changeable content when searching nfts
  const { data: userNFTs, loading: loadingUserNFTs } =
    useFetchWalletNFTsWithoutSearchParams();

  const { loans } = useFetchAllLoans();

  const setSearchDebounced = useDebounce((value: string) => {
    setSearch(value);
  }, 300);

  const parsedNfts = parseNFTs(nfts);

  const loading = initialLoading && !nfts?.length;

  const userHasNFTs = !!userNFTs?.length;

  return {
    nfts: userHasNFTs && !loading ? parsedNfts : collections,
    loans,
    setSearch: userHasNFTs ? setSearchDebounced : setSearchCollections,
    loading,
    fetchNextPage,
    userHasNFTs,
    loadingUserNFTs,
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
  const connection = useConnection();
  const history = useHistory();
  const wallet = useWallet();

  const goToToBorrowSuccessPage = () => history.push(PATHS.BORROW_SUCCESS);

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const onSubmit = async (nft: NFT) => {
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
        mint: nft?.mint,
        bondOrderParams: bondOrderParams?.orderParams,
        market,
        wallet,
        connection,
      });

      if (!result) {
        throw new Error('Borrow failed');
      }
      goToToBorrowSuccessPage();
    } catch (error) {
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
  mint,
  bondOrderParams,
  market,
  connection,
  wallet,
}) => {
  const {
    createLookupTableTxn,
    extendLookupTableTxns,
    createAndSellBondsIxsAndSigners,
  } = await makeCreateBondMultiOrdersTransaction({
    nftMint: mint,
    market,
    bondOrderParams: bondOrderParams,
    connection,
    wallet,
  });

  return await signAndSendV0TransactionWithLookupTables({
    createLookupTableTxns: [createLookupTableTxn],
    extendLookupTableTxns: extendLookupTableTxns,
    v0InstructionsAndSigners: [createAndSellBondsIxsAndSigners],
    connection,
    wallet,
    commitment: 'confirmed',
    onAfterSend: () => {
      notify({
        message: 'Transactions sent!',
        type: NotifyType.INFO,
      });
    },
    onSuccess: () => {
      notify({
        message: 'Borrowed successfully!',
        type: NotifyType.SUCCESS,
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
  });
};
