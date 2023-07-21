import { FC } from 'react';
import classNames from 'classnames';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { LoanDuration } from '@frakt/api/nft';
import { Tabs } from '@frakt/components/Tabs';
import { Loader } from '@frakt/components/Loader';
import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { BorrowMode } from '@frakt/pages/BorrowPages/types';

import { BorrowManualTable } from './components/BorrowManualTable';
import { RootHeader } from '../components/RootHeader';
import { useBorrowManualLitePage, useSortWalletNFTs } from './hooks';
import { Sidebar } from './components/Sidebar';

import styles from './BorrowManualLitePage.module.scss';

export const BorrowManualLitePage: FC = () => {
  const {
    wallet,
    maxBorrowValue,
    maxBorrowValueLoading,
    durationTabs,
    duration,
    onDurationTabClick,
    nfts,
    maxNfts,
    findNftInCart,
    onNftClick,
    currentNft,
    loanType,
    totalBorrowValue,
    isBulk,
    getBondFee,
    getBondLoanValue,
    dataLoading,
    cartNfts,
    clearCart,
    orderParamsByMint,
    selectNextCurrentNft,
    setSearch,
    resetCache,
    fetchMoreTrigger,
    goToProBorrowing,
    searchSelectParams,
  } = useBorrowManualLitePage();

  const { sortedNFTs, sortParams } = useSortWalletNFTs(nfts);

  return (
    <AppLayout>
      <div
        className={classNames(styles.container, {
          [styles.containerSidebarVisible]: !!currentNft,
        })}
      >
        <RootHeader
          collateralsAmount={maxNfts}
          availableToBorrow={maxBorrowValue}
          onModeSwitch={goToProBorrowing}
          mode={BorrowMode.LITE}
        />

        <div className={styles.content}>
          {!wallet?.connected && (
            <ConnectWalletSection text="Connect your wallet to see your nfts" />
          )}

          {wallet.connected && (
            <>
              {!maxBorrowValueLoading && (
                <div className={styles.tabsWrapper}>
                  <Tabs
                    tabs={durationTabs}
                    value={duration}
                    setValue={onDurationTabClick}
                    className={styles.tabs}
                    additionalClassNames={{
                      tabClassName: styles.tab,
                      tabActiveClassName: styles.tabActive,
                    }}
                    type="unset"
                  />
                </div>
              )}

              {(dataLoading || maxBorrowValueLoading) && <Loader />}

              {!dataLoading && !!nfts && (
                <>
                  <BorrowManualTable
                    data={sortedNFTs.map((nft) => ({
                      nft,
                      active: currentNft?.mint === nft.mint,
                      selected: !!findNftInCart({ nftMint: nft.mint }),
                      bondFee: getBondFee(nft),
                      bondLoanValue: getBondLoanValue(nft),
                    }))}
                    searchSelectParams={searchSelectParams}
                    duration={duration as LoanDuration}
                    setSearch={setSearch}
                    onRowClick={(nft) => onNftClick(nft?.nft)}
                    activeNftMint={currentNft?.mint}
                    sortParams={sortParams}
                  />
                  <div ref={fetchMoreTrigger} />
                </>
              )}
            </>
          )}
        </div>
        {!!currentNft && (
          <Sidebar
            loanType={loanType}
            totalBorrowValue={totalBorrowValue}
            isBulk={isBulk}
            currentNft={currentNft}
            onNftClick={onNftClick}
            clearCart={clearCart}
            cartNfts={cartNfts}
            orderParamsByMint={orderParamsByMint}
            selectNextCurrentNft={selectNextCurrentNft}
            resetCache={resetCache}
          />
        )}
      </div>
    </AppLayout>
  );
};
