import { FC } from 'react';

import { LoadingModal } from '@frakt/components/LoadingModal';

import { useBorrowSingleBond, useConnectedBorrowContent } from './hooks';
import { Search } from '../../../Search';
import { NFTsList } from '../../../NFTsList';
import MyLoans from '../MyLoans';

import AvailableBorrow from '../AvailableBorrow';
import styles from './ConnectedBorrowContent.module.scss';

const ConnectedBorrowContent: FC = () => {
  const { onSubmit, loadingModalVisible, closeLoadingModal } =
    useBorrowSingleBond();

  const { setSearch, nfts, loans, loading, fetchNextPage } =
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
              nfts={nfts}
              fetchNextPage={fetchNextPage}
              isLoading={loading}
              onClick={onSubmit}
              className={styles.nftsList}
            />
          </div>
        </div>
        <div className={styles.content}>
          <AvailableBorrow />
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
