import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useFetchAllLoans } from '@frakt/pages/LoansPage/components/LoansActiveTab/hooks';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { Loader } from '@frakt/components/Loader';

import { useBorrowSingleBond, useConnectedBorrowContent } from './hooks/hooks';
import CollectionsInfo from '../CollectionsInfo/CollectionsInfo';
import AvailableBorrow from '../AvailableBorrow';
import { NFTsList } from '../../../NFTsList';
import { Search } from '../../../Search';
import Heading from '../../../Heading';
import MyLoans from '../MyLoans';

import styles from './ConnectedBorrowContent.module.scss';
import {
  useFetchAvailableToBorrowUser,
  useFetchCollectionsStats,
} from '@frakt/pages/DashboardPage/hooks';

const ConnectedBorrowContent: FC = () => {
  const { publicKey, connected } = useWallet();

  const { data: collectionsStats } = useFetchCollectionsStats();
  const { loans, isLoading: isLoadingLoans } = useFetchAllLoans();
  const { data: availableBorrowData, isLoading: isLoadingAvailableBorrow } =
    useFetchAvailableToBorrowUser({
      walletPublicKey: publicKey,
    });

  const { onSubmit, loadingModalVisible, closeLoadingModal } =
    useBorrowSingleBond();

  const { setSearch, nfts, loading, fetchNextPage, loadingUserNFTs, hideNFT } =
    useConnectedBorrowContent();

  const showAvailableBorrow = connected && !!availableBorrowData?.maxBorrow;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.searchableList}>
          <Search
            title="Click to borrow"
            onChange={setSearch}
            className={styles.search}
          />
          <div className={styles.nftsListWrapper}>
            <NFTsList
              nfts={nfts}
              fetchNextPage={fetchNextPage}
              isLoading={loading}
              onClick={onSubmit}
              className={styles.nftsList}
              hideNFT={hideNFT}
            />
          </div>
        </div>
        <div className={styles.content}>
          {showAvailableBorrow && (
            <AvailableBorrow availableBorrowData={availableBorrowData} />
          )}
          {connected && (isLoadingLoans || isLoadingAvailableBorrow) && (
            <Loader />
          )}
          {!availableBorrowData?.maxBorrow && !isLoadingAvailableBorrow && (
            <div>
              <Heading className={styles.title} title="Available to borrow" />
              <CollectionsInfo
                collectionsStats={collectionsStats}
                hiddenButton
              />
              <p className={styles.notNftsMessage}>
                You don't have NFTs which we whitelisted
              </p>
            </div>
          )}
          {!!loans?.length && !loadingUserNFTs && <MyLoans loans={loans} />}
        </div>
      </div>
      <LoadingModal
        title="Please approve all transactions"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};

export default ConnectedBorrowContent;
