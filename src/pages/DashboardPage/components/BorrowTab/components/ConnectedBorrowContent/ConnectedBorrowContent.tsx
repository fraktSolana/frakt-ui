import { FC } from 'react';

import { useWalletNfts } from '@frakt/pages/BorrowPages/BorrowManualPage/hooks';
import { useFetchAllLoans } from '@frakt/pages/LoansPage/components/LoansActiveTab/hooks';
import { useDebounce } from '@frakt/hooks';

import { SearchHeading } from '../SearchableList';
import NFTsList from '../../../NFTsList';
import BorrowInfo from '../BorrowInfo';
import MyLoans from '../MyLoans';

import styles from './ConnectedBorrowContent.module.scss';
import { useConnectedBorrowContent } from './hooks';

const ConnectedBorrowContent: FC = () => {
  const { nfts, fetchNextPage, initialLoading, setSearch } = useWalletNfts();
  const { loans } = useFetchAllLoans();
  console.log(nfts);
  const { setCurrentNft, onSubmit } = useConnectedBorrowContent();

  const setSearchDebounced = useDebounce((value: string) => {
    setSearch(value);
  }, 300);

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <SearchHeading title="Click to borrow" onChange={setSearchDebounced} />
        <div className={styles.nftList}>
          <NFTsList
            nfts={nfts}
            fetchNextPage={fetchNextPage}
            isLoading={initialLoading}
            onClick={onSubmit}
          />
        </div>
      </div>
      <div className={styles.content}>
        <BorrowInfo />
        <MyLoans userLoans={loans} />
      </div>
    </div>
  );
};

export default ConnectedBorrowContent;
