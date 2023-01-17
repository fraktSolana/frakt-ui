import { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import InfinityScroll from '@frakt/components/InfinityScroll';
import { useDebounce } from '@frakt/hooks';

import { BorrowHeader } from '../components/BorrowHeader';
import { Filters } from './components/Filters';
import { useWalletNfts } from './hooks';
import { NftCard } from './components/NftCard/';
import { useSelectedNfts } from '../hooks';
import styles from './BorrowManualPage.module.scss';

export const BorrowManualPage: FC = () => {
  const {
    selection,
    toggleNftInSelection,
    findNftInSelection,
    highlightedNftMint,
  } = useSelectedNfts();

  const history = useHistory();
  const onBackBtnClick = () => history.goBack();

  const {
    nfts,
    fetchNextPage,
    initialLoading,
    setSearch,
    setSortName,
    setSortOrder,
  } = useWalletNfts();

  const setSearchDebounced = useDebounce((value: string) => {
    setSearch(value);
  }, 300);

  return (
    <AppLayout>
      <BorrowHeader
        onBackBtnClick={onBackBtnClick}
        title="Borrow SOL"
        subtitle={
          selection.length > 1
            ? `${selection.length} loans in bulk`
            : 'I just want to make a loan'
        }
      />
      <div className={styles.content}>
        <Filters
          setSearch={setSearchDebounced}
          onSortChange={({ name, order }) => {
            setSortName(name);
            setSortOrder(order);
          }}
        />
        <InfinityScroll
          itemsToShow={nfts.length}
          next={fetchNextPage}
          wrapperClassName={styles.nftsList}
          isLoading={initialLoading}
          customLoader={<p className={styles.loader}>loading your jpegs</p>}
        >
          {nfts.map((nft) => (
            <NftCard
              key={nft.mint}
              nft={nft}
              onClick={() => toggleNftInSelection(nft)}
              selected={!!findNftInSelection(nft.mint)}
              highlighted={nft.mint === highlightedNftMint}
            />
          ))}
        </InfinityScroll>
      </div>
    </AppLayout>
  );
};
