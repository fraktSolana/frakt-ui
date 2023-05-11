import { FC } from 'react';
import classNames from 'classnames';

// import { useIntersection } from '@frakt/hooks/useIntersection';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { LoanDuration } from '@frakt/api/nft';
import { Tabs } from '@frakt/components/Tabs';
import { Loader } from '@frakt/components/Loader';

import { Sidebar } from './components/Sidebar';
import { BorrowManualTable } from './components/BorrowManualTable';
import { useBorrowManualLitePage } from './hooks';
import styles from './BorrowManualLitePage.module.scss';

export const BorrowManualLitePage: FC = () => {
  // const { ref, inView } = useIntersection();

  const {
    wallet,
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
  } = useBorrowManualLitePage();

  // const setSearch = () => {};

  return (
    <AppLayout>
      <div
        className={classNames(styles.container, {
          [styles.containerSidebarVisible]: !!currentNft,
        })}
      >
        <div className={styles.header}>
          <h1>Borrow SOL</h1>
        </div>

        {wallet.connected && !maxBorrowValueLoading && (
          <div className={styles.content}>
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
                  setSearch={() => {}}
                  onRowClick={(nft) => onNftClick(nft?.nft)}
                  activeNftMint={currentNft?.mint}
                />
                {/* <div ref={ref} /> */}
              </div>
            )}
          </div>
        )}

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
          />
        )}
      </div>
    </AppLayout>
  );
};
