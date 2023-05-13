import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { LoadingModal } from '@frakt/components/LoadingModal';
import { Loader } from '@frakt/components/Loader';

import { useBorrowSingleBond, useConnectedBorrowContent } from './hooks';
import CollectionsInfo from '../CollectionsInfo/CollectionsInfo';
import AvailableBorrow from '../AvailableBorrow';
import { NFTsList } from '../../../NFTsList';
import { Search } from '../../../Search';
import Heading from '../../../Heading';
import MyLoans from '../MyLoans';

import styles from './ConnectedBorrowContent.module.scss';

const ConnectedBorrowContent: FC = () => {
  const { onSubmit, loadingModalVisible, closeLoadingModal } =
    useBorrowSingleBond();

  const { setSearch, nfts, loans, loading, fetchNextPage, userHasNFTs } =
    useConnectedBorrowContent();

  const { connected } = useWallet();
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
            />
          </div>
        </div>
        <div className={styles.content}>
          {!userHasNFTs && connected && <Loader />}
          {userHasNFTs && <AvailableBorrow />}

          {!userHasNFTs && !connected && (
            <div>
              <Heading className={styles.title} title="Available to borrow" />
              <CollectionsInfo hiddenButton />
              <p className={styles.notNftsMessage}>
                You don't have NFTs which we whitelisted
              </p>
            </div>
          )}
          {!!loans?.length && <MyLoans loans={loans} />}
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
