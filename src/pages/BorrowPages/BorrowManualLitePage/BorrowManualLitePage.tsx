import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { BorrowNft, LoanDuration } from '@frakt/api/nft';
import { useWallet } from '@solana/wallet-adapter-react';
import { LoanType } from '@frakt/api/loans';
import { Tabs, useTabs } from '@frakt/components/Tabs';
// import { Loader } from '@frakt/components/Loader';
import { useIntersection } from '@frakt/hooks/useIntersection';

import { useCartStateLite, useMaxBorrow, useWalletNftsLite } from './hooks';
import { Sidebar } from './components/Sidebar';
import { DURATION_TABS } from './constants';
import { BorrowManualTable } from './components/BorrowManualTable';
import styles from './BorrowManualLitePage.module.scss';

export const useBorrowManualLitePage = () => {
  const wallet = useWallet();
  const { maxBorrow, isLoading: maxBorrowValueLoading } = useMaxBorrow({
    walletPublicKey: wallet?.publicKey,
  });

  const {
    tabs: durationTabs,
    value: duration,
    setValue: setDuration,
  } = useTabs({ tabs: DURATION_TABS, defaultValue: DURATION_TABS[0].value });

  const onDurationTabClick = (value: string) => {
    onBorrowValueChange('0');
    setDuration(value);
    clearCart();
  };

  const maxBorrowValue = useMemo(() => {
    return maxBorrow ? maxBorrow[duration] : 0;
  }, [maxBorrow, duration]);

  const {
    addNft,
    removeNft,
    clearCart,
    findNftInCart,
    getNftsCountByMarket,
    nfts: cartNfts,
    orderParamsByMint,
  } = useCartStateLite();

  const { isLoading, nfts, orders } = useWalletNftsLite({
    duration: duration as LoanDuration,
  });

  // const [isSuggestionRequested, setIsSuggestionRequested] =
  //   useState<boolean>(false);

  const [borrowValue, setBorrowValue] = useState<string>('');
  const [borrowPercentValue, setBorrowPercentValue] = useState<number>(0);

  const onBorrowPercentChange = useCallback(
    (nextValue: number) => {
      const depositValue =
        ((nextValue * maxBorrowValue) / 100)?.toFixed(2) || '0';
      setBorrowValue(depositValue);
      setBorrowPercentValue(nextValue);
    },
    [maxBorrowValue],
  );

  const onBorrowValueChange = useCallback(
    (nextValue: string) => {
      setBorrowValue(nextValue);

      const balancePercent = (parseFloat(nextValue) / maxBorrowValue) * 100;

      if (balancePercent > 100) {
        return setBorrowPercentValue(100);
      }
      if (balancePercent < 0) {
        return setBorrowPercentValue(0);
      }

      return setBorrowPercentValue(balancePercent);
    },
    [maxBorrowValue],
  );

  const onNftClick = (nft: BorrowNft) => {
    const isNftSelected = !!findNftInCart({ nftMint: nft.mint });

    const loanType = duration === '0' ? LoanType.PRICE_BASED : LoanType.BOND;
    if (isNftSelected) {
      return removeNft({
        nftMint: nft.mint,
        loanType,
      });
    }

    if (loanType === LoanType.PRICE_BASED) {
      addNft({
        nft,
        loanType,
        orderParams: null,
      });
    }

    if (loanType === LoanType.BOND) {
      const sameCollectionInCartCount = getNftsCountByMarket({
        marketPubkey: nft.bondParams.marketPubkey,
      });

      addNft({
        nft,
        loanType,
        orderParams:
          orders[nft.bondParams.marketPubkey][sameCollectionInCartCount],
      });
    }
  };

  const totalBorrowValue = useMemo(() => 10, []);

  useEffect(() => {
    onBorrowValueChange((totalBorrowValue / 1e9).toFixed(2));
  }, [totalBorrowValue, onBorrowValueChange]);

  const currentNft = useMemo(() => {
    return cartNfts.at(-1) ?? null;
  }, [cartNfts]);

  const getCurrentNftOrderParams = useCallback(() => {
    return orderParamsByMint?.[currentNft?.mint] ?? null;
  }, [currentNft, orderParamsByMint]);

  return {
    wallet,

    maxBorrowValueLoading,
    maxBorrowValue,
    borrowValue,

    borrowPercentValue,
    onBorrowValueChange,
    onBorrowPercentChange,

    durationTabs,
    duration,
    onDurationTabClick,

    nfts,
    isLoading,
    onNftClick,
    findNftInCart,
    orders,
    currentNft,
    getCurrentNftOrderParams,
    loanType: duration === '0' ? LoanType.PRICE_BASED : LoanType.BOND,

    cartNfts,
    orderParamsByMint,

    isBulk: nfts.length > 0,
    totalBorrowValue: 5000, //TODO
    clearCart,
  };
};

export const BorrowManualLitePage: FC = () => {
  const { ref, inView } = useIntersection();

  const {
    wallet,
    maxBorrowValueLoading,
    durationTabs,
    duration,
    onDurationTabClick,

    nfts,
    isLoading,
    findNftInCart,
    onNftClick,
    orders,
    currentNft,
    getCurrentNftOrderParams,
    loanType,
    totalBorrowValue,
    isBulk,
  } = useBorrowManualLitePage();

  const setSearch = () => {};

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

            {/* {!nfts?.length && initialLoading && <Loader />} */}

            <div className={styles.tableWrapper}>
              <BorrowManualTable
                data={nfts.map((nft) => ({
                  nft,
                  active: currentNft?.mint === nft.mint,
                  selected: !!findNftInCart({ nftMint: nft.mint }),
                  bondFee: 0, //TODO: Get from bond combinations
                  bondLoanValue: 0, //TODO: Get from bond combinations
                }))}
                duration={duration as LoanDuration}
                setSearch={setSearch}
                // setQueryData={setQueryData}
                onRowClick={(nft) => onNftClick(nft?.nft)}
                activeNftMint={currentNft?.mint}
              />
              <div ref={ref} />
            </div>
          </div>
        )}

        {!!currentNft && (
          <Sidebar
            loanType={loanType}
            totalBorrowValue={totalBorrowValue}
            isBulk={isBulk}
          />
        )}
      </div>
    </AppLayout>
  );
};
