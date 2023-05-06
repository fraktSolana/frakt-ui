import { FC } from 'react';

import { useWalletNfts } from '@frakt/pages/BorrowPages/BorrowManualPage/hooks';
import { useWallet } from '@solana/wallet-adapter-react';

import AvailableBorrow from './components/AvailableBorrow';
import NFTsList from '../NFTsList';

import styles from './BorrowTab.module.scss';
import { useMarketsPreview } from '@frakt/pages/MarketsPage/hooks';
import NftCard from '../NftCard';
import MyLoans from './components/MyLoans';
import { useFetchAllLoans } from '@frakt/pages/LoansPage/components/LoansActiveTab/hooks';
import BorrowInfo from './components/BorrowInfo';
import { useDebounce } from '@frakt/hooks';
import { SearchInput } from '@frakt/components/SearchInput';
import { Loader } from '@frakt/components/Loader';

const BorrowTab: FC = () => {
  const { connected } = useWallet();

  return (
    <div className={styles.wrapper}>
      {connected && <ConnectedBorrowContent />}
      {!connected && <NotConnectedBorrowContent />}
    </div>
  );
};

export default BorrowTab;

const NotConnectedBorrowContent = () => {
  const { marketsPreview } = useMarketsPreview();

  return (
    <div className={styles.gridContainer}>
      <AvailableBorrow />
      {!marketsPreview?.length && <Loader />}
      {marketsPreview.map((nft) => (
        <NftCard key={nft?.marketPubkey} nftImage={nft.collectionImage} />
      ))}
    </div>
  );
};

const ConnectedBorrowContent = () => {
  const { nfts, fetchNextPage, initialLoading, setSearch } = useWalletNfts();
  const { loans } = useFetchAllLoans();

  const setSearchDebounced = useDebounce((value: string) => {
    setSearch(value);
  }, 300);

  return (
    <div className={styles.flexContainer}>
      <div className={styles.column}>
        <SearchHeading onChange={setSearchDebounced} />
        <NFTsList
          nfts={nfts}
          fetchNextPage={fetchNextPage}
          isLoading={initialLoading}
        />
      </div>
      <div className={styles.content}>
        <BorrowInfo />
        <MyLoans userLoans={loans} />
      </div>
    </div>
  );
};

const SearchHeading = ({ onChange }) => (
  <div className={styles.heading}>
    <h3 className={styles.title}>Click to borrow</h3>
    <SearchInput
      type="input"
      onChange={(event) => onChange(event.target.value)}
      className={styles.searchInput}
      placeholder="Search by name"
    />
  </div>
);
