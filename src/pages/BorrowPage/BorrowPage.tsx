import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';

import { ConnectWalletSection } from '../../components/ConnectWalletSection';
import { AppLayout } from '../../components/Layout/AppLayout';
import { loansActions } from '../../state/loans/actions';
import NoSuitableNft from './components/NoSuitableNft';
import { BorrowType, useBorrowPage } from './hooks';
import BorrowBulk from './components/BorrowBulk';
import BorrowNft from './components/BorrowManual';
import styles from './BorrowPage.module.scss';
import Button from '../../components/Button';
import { Loader } from '../../components/Loader';
import { Slider } from '../../components/Slider';
import Header from './components/Header';

const BorrowPage: FC = () => {
  const { connected } = useWallet();
  const dispatch = useDispatch();

  const [borrowType, setBorrowType] = useState<BorrowType>(null);

  const {
    marks,
    bulks,
    borrowValue,
    setBorrowValue,
    loading,
    availableBorrowValue,
    onSubmit,
  } = useBorrowPage();

  return (
    <>
      {borrowType === null && (
        <AppLayout>
          <Header
            title="Borrow SOL"
            subtitle="Select your NFT to use as a collateral"
          />

          {!connected && (
            <ConnectWalletSection text="Connect your wallet to check ..." />
          )}

          {connected && (
            <div className={styles.wrapper}>
              <div className={styles.block}>
                <h3 className={styles.blockTitle}>Pick for me</h3>
                <p className={styles.blockSubtitle}>I need...</p>
                <div className={styles.blockContent}>
                  <Slider
                    marks={marks}
                    className={styles.slider}
                    value={borrowValue}
                    step={1}
                    max={Number(availableBorrowValue)}
                    setValue={setBorrowValue}
                    withTooltip
                  />
                  <Button
                    onClick={() => {
                      onSubmit();
                      setBorrowType(BorrowType.BULK);
                    }}
                    disabled={!borrowValue}
                    className={styles.btn}
                    type="secondary"
                  >
                    {"Let's go"}
                  </Button>
                </div>
              </div>
              <div className={styles.block}>
                <h3 className={styles.blockTitle}>Select NFTs manually</h3>
                <p className={styles.blockSubtitle}></p>
                <Button
                  onClick={() => {
                    setBorrowType(BorrowType.SINGLE);
                    dispatch(loansActions.setBulkNfts([]));
                    dispatch(loansActions.updatePerpLoanNft([]));
                    dispatch(loansActions.setCurrentNftLoan(null));
                  }}
                  className={styles.btnConfirm}
                  type="secondary"
                >
                  Select
                </Button>
              </div>
            </div>
          )}
        </AppLayout>
      )}

      {borrowType === BorrowType.BULK && (
        <AppLayout>
          {!!bulks?.best?.length && (
            <BorrowBulk
              onBack={() => setBorrowType(BorrowType.SINGLE)}
              onClick={() => setBorrowType(null)}
              value={borrowValue}
              bulks={bulks}
            />
          )}

          {loading && <Loader size="large" />}

          {!loading && !bulks?.best?.length && (
            <>
              <Header
                title="Borrowing"
                subtitle={`I need ${borrowValue} SOL`}
              />
              <NoSuitableNft />
            </>
          )}
        </AppLayout>
      )}
      {borrowType === BorrowType.SINGLE && (
        <BorrowNft onClick={() => setBorrowType(null)} />
      )}
    </>
  );
};

export default BorrowPage;
