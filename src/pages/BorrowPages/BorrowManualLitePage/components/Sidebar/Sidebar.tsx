import { FC } from 'react';

import SidebarLayout from '@frakt/components/Sidebar';
import CollapsedContent from '@frakt/components/Sidebar/components/CollapsedContent';
import NftsCarousel from '@frakt/components/Sidebar/components/Slider';
import { LoadingModal } from '@frakt/components/LoadingModal';

import styles from './Sidebar.module.scss';
import { BorrowForm } from '../BorrowForm';
import { useSidebar } from './hooks';
import { LoanType } from '@frakt/api/loans';

interface SidebarProps {
  loanType: LoanType;
  totalBorrowValue: number;
  isBulk: boolean;
}

export const Sidebar: FC<SidebarProps> = ({
  loanType,
  totalBorrowValue,
  isBulk,
}) => {
  const {
    minimizedOnMobile,
    setMinimizedOnMobile,
    onSubmit,
    loadingModalVisible,
    setLoadingModalVisible,
    currentNft,
    onNftClick,
  } = useSidebar({
    loanType,
    totalBorrowValue,
    isBulk,
  });

  return (
    <>
      <SidebarLayout
        setVisible={() => setMinimizedOnMobile((prev) => !prev)}
        contentVisible={!minimizedOnMobile}
        isSidebarVisible={true}
      >
        <CollapsedContent
          isVisible={!minimizedOnMobile}
          onClick={onSubmit}
          title={`Borrow ${(totalBorrowValue / 1e9).toFixed(2)} SOL`}
        />
        <div className={styles.sidebar}>
          <NftsCarousel
            nfts={currentNft}
            onDeselect={() => onNftClick(currentNft)}
            // onPrev={() => onNextNftSelect(true)}
            // onNext={() => onNextNftSelect()}
            isBulkLoan={isBulk}
          />
          <BorrowForm
            onSubmit={onSubmit}
            loanType={loanType}
            totalBorrowValue={totalBorrowValue}
          />
        </div>
      </SidebarLayout>
      <LoadingModal
        title="Please approve transactions"
        subtitle={`In order to transfer the NFT/s approval is needed.\nPlease do not leave the page while you see this message`}
        visible={loadingModalVisible}
        onCancel={() => setLoadingModalVisible(false)}
      />
    </>
  );
};
