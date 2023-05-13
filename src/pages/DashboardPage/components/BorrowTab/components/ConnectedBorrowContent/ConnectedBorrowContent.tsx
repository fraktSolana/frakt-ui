import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useFetchAllLoans } from '@frakt/pages/LoansPage/components/LoansActiveTab/hooks';
import { useMaxBorrowValue } from '@frakt/pages/BorrowPages/BorrowRootPage/hooks';
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
  const { publicKey, connected } = useWallet();

  const { loans, isLoading: isLoadingLoans } = useFetchAllLoans();
  const { maxBorrowValue, isLoading: isLoadingMaxBorrow } = useMaxBorrowValue({
    walletPublicKey: publicKey,
  });

  const { onSubmit, loadingModalVisible, closeLoadingModal } =
    useBorrowSingleBond();

  const {
    setSearch,
    nfts,
    loading,
    fetchNextPage,
    userHasNFTs,
    loadingUserNFTs,
  } = useConnectedBorrowContent();

  const showAvailableBorrow = connected && !!maxBorrowValue;

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
          {connected && (isLoadingLoans || isLoadingMaxBorrow) && <Loader />}
          {showAvailableBorrow && (
            <AvailableBorrow maxBorrowValue={maxBorrowValue} />
          )}
          {!maxBorrowValue && !isLoadingMaxBorrow && (
            <div>
              <Heading className={styles.title} title="Available to borrow" />
              <CollectionsInfo hiddenButton />
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
