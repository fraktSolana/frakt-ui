import { FC } from 'react';

import SidebarLayout from '@frakt/components/Sidebar';
import CollapsedContent from '@frakt/components/Sidebar/components/CollapsedContent';
import NftsCarousel from '@frakt/components/Sidebar/components/Slider';
import { Loader } from '@frakt/components/Loader';
import { LoadingModal } from '@frakt/components/LoadingModal';

import styles from './Sidebar.module.scss';
import { BorrowForm } from '../BorrowForm';
import { useSidebar } from './hooks';

export const Sidebar: FC = () => {
  const {
    isLoading,
    isBulk,
    totalBorrowValue,
    currentNft,
    onRemoveNft,
    onNextNftSelect,
    minimizedOnMobile,
    setMinimizedOnMobile,
    onSubmit,
    loadingModalVisible,
    setLoadingModalVisible,
  } = useSidebar();

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
          title={`${isBulk ? 'View bulk loan' : 'Borrow'} ${(
            totalBorrowValue / 1e9
          ).toFixed(2)} SOL`}
        />
        <div className={styles.sidebar}>
          {isLoading && <Loader size="large" />}
          {!isLoading && !!currentNft && (
            <>
              <NftsCarousel
                nfts={currentNft}
                onDeselect={() => onRemoveNft(currentNft)}
                onPrev={() => onNextNftSelect(true)}
                onNext={() => onNextNftSelect()}
                isBulkLoan={isBulk}
              />
              <BorrowForm onSubmit={onSubmit} />
            </>
          )}
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
