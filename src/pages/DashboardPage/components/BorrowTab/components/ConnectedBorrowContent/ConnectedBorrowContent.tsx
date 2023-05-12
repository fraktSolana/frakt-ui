import { FC } from 'react';

import { LoadingModal } from '@frakt/components/LoadingModal';

import { useBorrowSingleBond, useConnectedBorrowContent } from './hooks';
import AvailableBorrow from '../AvailableBorrow';
import { NFTsList } from '../../../NFTsList';
import { Search } from '../../../Search';
import MyLoans from '../MyLoans';

import CollectionsInfo from '../CollectionsInfo/CollectionsInfo';
import Heading from '../../../Heading';

import styles from './ConnectedBorrowContent.module.scss';

const ConnectedBorrowContent: FC = () => {
  const { onSubmit, loadingModalVisible, closeLoadingModal } =
    useBorrowSingleBond();

  const { setSearch, nfts, loans, loading, fetchNextPage, isUserHasNFTs } =
    useConnectedBorrowContent();

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
              nfts={nfts as any}
              fetchNextPage={fetchNextPage}
              isLoading={loading}
              onClick={onSubmit}
              className={styles.nftsList}
            />
          </div>
        </div>
        <div className={styles.content}>
          {isUserHasNFTs ? (
            <AvailableBorrow />
          ) : (
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
