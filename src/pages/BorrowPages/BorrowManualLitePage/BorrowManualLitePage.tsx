import { FC } from 'react';
import classNames from 'classnames';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import Toggle from '@frakt/components/Toggle';
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
  } = useBorrowManualLitePage();

  return (
    <AppLayout>
      <div
        className={classNames(styles.container, {
          [styles.containerSidebarVisible]: !!currentNft,
        })}
      >
        <Header
          collateralsAmount={maxNfts}
          availableToBorrow={maxBorrowValue}
          onChange={goToProBorrowing}
          checked={false}
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
                  <div ref={fetchMoreTrigger} />
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
            resetCache={resetCache}
          />
        )}
      </div>
    </AppLayout>
  );
};

interface HeaderProps {
  collateralsAmount?: number;
  availableToBorrow?: number;
  checked?: boolean;
  onChange: () => void;
}

export const Header: FC<HeaderProps> = ({
  collateralsAmount,
  availableToBorrow,
  checked,
  onChange,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headingWrapper}>
        <h1>Borrow SOL</h1>
        <Toggle
          className={styles.rootToggle}
          innerClassName={styles.toggleInner}
          defaultChecked={checked}
          onChange={onChange}
        />
      </div>

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
              <span>Available to borrow:</span>
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
