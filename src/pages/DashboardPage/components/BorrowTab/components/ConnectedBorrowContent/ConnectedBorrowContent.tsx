import { FC } from 'react';

import { useWalletNfts } from '@frakt/pages/BorrowPages/BorrowManualPage/hooks';
import { useFetchAllLoans } from '@frakt/pages/LoansPage/components/LoansActiveTab/hooks';
import { useDebounce } from '@frakt/hooks';

import { SearchHeading } from '../SearchableList';
import NFTsList from '../../../NFTsList';
import BorrowInfo from '../BorrowInfo';
import MyLoans from '../MyLoans';

import styles from './ConnectedBorrowContent.module.scss';
import { parseNft } from './helpers';

const ConnectedBorrowContent: FC = () => {
  const {
    nfts: rawNFTs,
    fetchNextPage,
    initialLoading,
    setSearch,
  } = useWalletNfts();
  const { loans } = useFetchAllLoans();

  const nfts = parseNft(rawNFTs);

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
