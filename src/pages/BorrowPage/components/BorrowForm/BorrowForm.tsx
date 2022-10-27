import { FC } from 'react';
import { Controller } from 'react-hook-form';

import { FilterFormInputsNames } from '../../hooks/useBorrowPageFilter';
import { LoadingModal } from '../../../../components/LoadingModal';
import { ConfirmModal } from '../../../../components/ConfirmModal';
import { getRisk, useLoanFields } from '../LoanFields/hooks';
import { BorrowNft } from '../../../../state/loans/types';
import { Slider } from '../../../../components/Slider';
import { Select } from '../../../../components/Select';
import Button from '../../../../components/Button';
import styles from './BorrowForm.module.scss';
import { useBorrowForm } from './hooks';
import LoansFields from '../LoanFields';

interface BorrowFormProps {
  selectedNft: BorrowNft;
  isBulkLoan?: boolean;
  onDeselect?: () => void;
  onClick?: () => void;
  totalBorrowed?: number;
}

export enum BorrowFormType {
  PERPETUAL = 'perpetual',
  FLIP = 'flip',
}

const BorrowForm: FC<BorrowFormProps> = ({
  selectedNft,
  onDeselect,
  isBulkLoan,
  onClick,
  totalBorrowed,
}) => {
  const {
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    onSubmit,
    confirmText,
    selectOptions,
    selectValue,
    updateCurrentNft,
    solLoanValue,
    setSolLoanValue,
    control,
  } = useBorrowForm({
    onDeselect,
    selectedNft,
  });

  const { marks, maxLoanValueNumber, minLoanValueNumber, averageLoanValue } =
    useLoanFields(selectedNft, solLoanValue);

  const ltv = (solLoanValue / parseFloat(selectedNft.valuation)) * 100;

  const risk = getRisk({ LTV: ltv, limits: [10, ltv] });

  const borrowValue = solLoanValue.toFixed(3);

  return (
    <>
      <div className={styles.details}>
        <p className={styles.detailsTitle}>Duration</p>
        <Controller
          control={control}
          name={FilterFormInputsNames.SORT}
          render={({ field: { value, name, onChange } }) => (
            <Select
              options={selectOptions}
              name={name}
              value={value}
              onChange={onChange}
            />
          )}
        />
        <div className={styles.sliderWrapper}>
          <p className={styles.sliderLabel}>
            To borrow: {solLoanValue.toFixed(2)} SOL{' '}
          </p>
          <Slider
            marks={marks}
            className={styles.slider}
            value={solLoanValue}
            step={0.1}
            setValue={setSolLoanValue}
            min={minLoanValueNumber}
            max={maxLoanValueNumber}
          />
        </div>
        <LoansFields
          risk={risk}
          ltv={ltv}
          nft={selectedNft}
          loanTypeValue={selectValue}
          solLoanValue={solLoanValue}
        />
      </div>
      <div className={styles.continueBtnContainer}>
        <Button
          onClick={
            isBulkLoan
              ? () => {
                  updateCurrentNft();
                  onClick();
                }
              : openConfirmModal
          }
          type="secondary"
          className={styles.continueBtn}
        >
          {isBulkLoan
            ? `View bulk loan ${totalBorrowed.toFixed(2)}  SOL`
            : `Quick borrow ${borrowValue}`}
        </Button>
      </div>
      <ConfirmModal
        visible={confirmModalVisible}
        onCancel={closeConfirmModal}
        onSubmit={() => onSubmit(selectedNft)}
        title="Ready?"
        subtitle={confirmText}
        btnAgree="Let's go"
      />
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
        subtitle="In order to transfer the NFT/s approval is needed"
      />
    </>
  );
};

export default BorrowForm;
