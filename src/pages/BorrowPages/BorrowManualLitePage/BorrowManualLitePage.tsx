import { FC } from 'react';
import classNames from 'classnames';

// import { useIntersection } from '@frakt/hooks/useIntersection';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { LoanDuration } from '@frakt/api/nft';
import { Tabs } from '@frakt/components/Tabs';
import { Loader } from '@frakt/components/Loader';
import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { Solana } from '@frakt/icons';

import { Sidebar } from './components/Sidebar';
import { BorrowManualTable } from './components/BorrowManualTable';
import { useBorrowManualLitePage } from './hooks';
import styles from './BorrowManualLitePage.module.scss';

export const BorrowManualLitePage: FC = () => {
  // const { ref, inView } = useIntersection();

  const {
    wallet,
    maxBorrowValue,
    maxBorrowValueLoading,
    durationTabs,
    duration,
    onDurationTabClick,
    nfts,
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
  } = useBorrowManualLitePage();

  return (
    <AppLayout>
      <div
        className={classNames(styles.container, {
          [styles.containerSidebarVisible]: !!currentNft,
        })}
      >
        <Header
          collateralsAmount={nfts?.length}
          availableToBorrow={maxBorrowValue}
        />

        <div className={styles.content}>
          {!wallet?.connected && (
            <ConnectWalletSection text="Connect your wallet to see your nfts" />
          )}

          {wallet.connected && !maxBorrowValueLoading && (
            <>
              <div className={styles.tabsWrapper}>
                <h3 className={styles.subtitle}>Duration</h3>
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

              {!!dataLoading && <Loader />}

              {!dataLoading && !!nfts && (
                <div className={styles.tableWrapper}>
                  <BorrowManualTable
                    data={nfts.map((nft) => ({
                      nft,
                      active: currentNft?.mint === nft.mint,
                      selected: !!findNftInCart({ nftMint: nft.mint }),
                      bondFee: getBondFee(nft),
                      bondLoanValue: getBondLoanValue(nft),
                    }))}
                    duration={duration as LoanDuration}
                    setSearch={setSearch}
                    onRowClick={(nft) => onNftClick(nft?.nft)}
                    activeNftMint={currentNft?.mint}
                  />
                  {/* <div ref={ref} /> */}
                </div>
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
          />
        )}
      </div>
    </AppLayout>
  );
};

interface HeaderProps {
  collateralsAmount?: number;
  availableToBorrow?: number;
}

const Header: FC<HeaderProps> = ({ collateralsAmount, availableToBorrow }) => {
  return (
    <div className={styles.header}>
      <h1>Borrow SOL</h1>

      {(!!collateralsAmount || !!availableToBorrow) && (
        <div className={styles.headerStatsWrapper}>
          {!!collateralsAmount && (
            <div className={styles.headerStats}>
              <span>Amount of collaterals:</span>
              <span>{collateralsAmount}</span>
            </div>
          )}
          {!!availableToBorrow && (
            <div className={styles.headerStats}>
              <span>Amount to borrow:</span>
              <span>
                {availableToBorrow.toFixed(2)} <Solana />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
