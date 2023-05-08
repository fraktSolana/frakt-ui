import { FC } from 'react';

import { useWalletNfts } from '@frakt/pages/BorrowPages/BorrowManualPage/hooks';
import { useFetchAllLoans } from '@frakt/pages/LoansPage/components/LoansActiveTab/hooks';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { useDebounce } from '@frakt/hooks';

import { useConnectedBorrowContent } from './hooks';
import { SearchHeading } from '../SearchableList';
import NFTsList from '../../../NFTsList';
import BorrowInfo from '../BorrowInfo';
import { parseNFTs } from './helpers';
import MyLoans from '../MyLoans';

import styles from './ConnectedBorrowContent.module.scss';

const ConnectedBorrowContent: FC = () => {
  const {
    nfts: rawNfts,
    fetchNextPage,
    initialLoading,
    setSearch,
  } = useWalletNfts();

  const { loans } = useFetchAllLoans();

  const { onSubmit, loadingModalVisible, closeLoadingModal } =
    useConnectedBorrowContent();

  const setSearchDebounced = useDebounce((value: string) => {
    setSearch(value);
  }, 300);

  const nfts = parseNFTs(rawNfts);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.searchableList}>
          <SearchHeading
            title="Click to borrow"
            onChange={setSearchDebounced}
            className={styles.search}
          />
          <div className={styles.wrapperNftsList}>
            <NFTsList
              nfts={nfts}
              fetchNextPage={fetchNextPage}
              isLoading={initialLoading}
              onClick={onSubmit}
              className={styles.nftsList}
            />
          </div>
        </div>
        <div className={styles.content}>
          <BorrowInfo />
          <MyLoans userLoans={loans} />
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
