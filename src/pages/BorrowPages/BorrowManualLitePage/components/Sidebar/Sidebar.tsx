import { FC } from 'react';
import { Dictionary } from 'lodash';
import { QuestionCircleOutlined } from '@ant-design/icons';

import SidebarLayout from '@frakt/components/Sidebar';
import CollapsedContent from '@frakt/components/Sidebar/components/CollapsedContent';
import NftsCarousel from '@frakt/components/Sidebar/components/Slider';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { LoanType } from '@frakt/api/loans';
import { BorrowNft, OrderParamsLite } from '@frakt/api/nft';
import Tooltip from '@frakt/components/Tooltip';
import Button from '@frakt/components/Button';

import styles from './Sidebar.module.scss';
import { useSidebar } from './hooks';
import { generateLoanDetails, generateSummary } from './helpers';

interface SidebarProps {
  loanType: LoanType;
  totalBorrowValue: number;
  isBulk: boolean;
  currentNft: BorrowNft;
  onNftClick: (nft: BorrowNft) => void;
  clearCart: () => void;
  cartNfts: BorrowNft[];
  orderParamsByMint: Dictionary<OrderParamsLite>;
}

export const Sidebar: FC<SidebarProps> = ({
  loanType,
  totalBorrowValue,
  isBulk,
  currentNft,
  onNftClick,
  clearCart,
  cartNfts,
  orderParamsByMint,
}) => {
  const {
    minimizedOnMobile,
    setMinimizedOnMobile,
    onSubmit,
    loadingModalVisible,
    setLoadingModalVisible,
  } = useSidebar({
    loanType,
    totalBorrowValue,
    isBulk,
    currentNft,
    onNftClick,
    clearCart,
    cartNfts,
    orderParamsByMint,
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
          <div className={styles.borrowForm}>
            <div className={styles.borrowFormDetails}>
              <LoanDetails
                currentNft={currentNft}
                orderParamsLite={orderParamsByMint[currentNft.mint]}
                loanType={loanType}
              />
            </div>
            <div className={styles.borrowFormSummary}>
              <p className={styles.borrowFormSummaryTitle}>Summary</p>
              <Summary
                nfts={cartNfts}
                orderParamsByMint={orderParamsByMint}
                loanType={loanType}
              />
            </div>
            <div className={styles.borrowFormSubmitBtnWrapper}>
              <Button
                onClick={onSubmit}
                type="secondary"
                className={styles.borrowFormSubmitBtn}
              >
                {`Borrow ${(totalBorrowValue / 1e9).toFixed(2)} SOL`}
              </Button>
            </div>
          </div>
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

interface SummaryProps {
  nfts: BorrowNft[];
  orderParamsByMint: Dictionary<OrderParamsLite>;
  loanType: LoanType;
}

const Summary: FC<SummaryProps> = ({ nfts, orderParamsByMint, loanType }) => {
  const fields = generateSummary({
    nfts,
    orderParamsByMint,
    loanType,
  });

  return (
    <div className={styles.loanDetails}>
      {fields.map(({ label, value, tooltipText }, idx) => (
        <div className={styles.loanDetailsValue} key={idx}>
          <span>
            {label}
            {tooltipText && (
              <Tooltip placement="bottom" trigger="hover" overlay={tooltipText}>
                <QuestionCircleOutlined className={styles.tooltipIcon} />
              </Tooltip>
            )}
          </span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};

interface LoanDetailsProps {
  currentNft: BorrowNft;
  orderParamsLite?: OrderParamsLite;
  loanType: LoanType;
}

const LoanDetails: FC<LoanDetailsProps> = ({
  currentNft,
  orderParamsLite,
  loanType,
}) => {
  if (!currentNft) return null;

  const fields = generateLoanDetails({
    nft: currentNft,
    orderParamsLite,
    loanType,
  });

  return (
    <div className={styles.loanDetails}>
      {fields.map(({ label, value, tooltipText }, idx) => (
        <div className={styles.loanDetailsValue} key={idx}>
          <span>
            {label}
            {tooltipText && (
              <Tooltip placement="bottom" trigger="hover" overlay={tooltipText}>
                <QuestionCircleOutlined className={styles.tooltipIcon} />
              </Tooltip>
            )}
          </span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};
