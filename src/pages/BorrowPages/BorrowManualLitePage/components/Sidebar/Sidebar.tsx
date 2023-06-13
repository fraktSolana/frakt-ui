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
import Checkbox from '@frakt/components/Checkbox';

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
  selectNextCurrentNft: (reverse?: boolean) => void;
  resetCache: () => void;
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
  selectNextCurrentNft,
  resetCache,
}) => {
  const {
    minimizedOnMobile,
    setMinimizedOnMobile,
    onSubmit,
    loadingModalVisible,
    setLoadingModalVisible,
    isLedger,
    setIsLedger,
  } = useSidebar({
    loanType,
    totalBorrowValue,
    isBulk,
    currentNft,
    onNftClick,
    clearCart,
    cartNfts,
    orderParamsByMint,
    resetCache,
  });

  return (
    <>
      <SidebarLayout
        setVisible={() => setMinimizedOnMobile((prev) => !prev)}
        contentVisible={!minimizedOnMobile}
        isSidebarVisible={true}
        className={styles.layout}
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
            onPrev={() => selectNextCurrentNft(true)}
            onNext={() => selectNextCurrentNft()}
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
            <div className={styles.checkboxWrapper}>
              <Checkbox
                onChange={() => setIsLedger?.(!isLedger)}
                label="I use ledger"
                checked={isLedger}
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
    <div className={styles.summaryDetails}>
      {fields.map(({ label, value, tooltipText }, idx) => (
        <div className={styles.summaryDetailsValue} key={idx}>
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

  if (loanType === LoanType.BOND && !orderParamsLite) return null;

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
