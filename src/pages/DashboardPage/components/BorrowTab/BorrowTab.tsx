import { FC } from 'react';

import { useWalletNfts } from '@frakt/pages/BorrowPages/BorrowManualPage/hooks';
import { useWallet } from '@solana/wallet-adapter-react';

import AvailableBorrow from '../AvailableBorrow';
import NFTsList from '../NFTsList';

import styles from './BorrowTab.module.scss';
import classNames from 'classnames';
import { useMarketsPreview } from '@frakt/pages/MarketsPage/hooks';
import NftCard from '../NftCard';
import MyLoans from '../MyLoans';
import { useFetchAllLoans } from '@frakt/pages/LoansPage/components/LoansActiveTab/hooks';

const BorrowTab: FC = () => {
  const { connected } = useWallet();
  // const { nfts, fetchNextPage, initialLoading, setSearch } = useWalletNfts();
  const { marketsPreview } = useMarketsPreview();
  const { loans, isLoading } = useFetchAllLoans();

  return (
    <div className={styles.wrapper}>
      {connected && (
        <ConnectedBorrowContent data={marketsPreview} loans={loans} />
      )}
      {!connected && <NotConnectedBorrowContent data={marketsPreview} />}
    </div>
  );
};

export default BorrowTab;

const NotConnectedBorrowContent = ({ data }) => (
  <div className={styles.gridContainer}>
    <AvailableBorrow />
    {data.map((nft) => (
      <NftCard key={nft?.imageUrl} nftImage={nft.imageUrl} />
    ))}
  </div>
);

const ConnectedBorrowContent = ({ data, loans }) => (
  <div className={styles.flexContainer}>
    <NFTsList nfts={data} />
    <div className={styles.column}>
      <AvailableBorrow />
      <MyLoans userLoans={loans} />
    </div>
  </div>
);
