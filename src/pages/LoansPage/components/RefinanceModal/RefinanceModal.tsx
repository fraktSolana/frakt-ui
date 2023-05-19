import { FC } from 'react';

import { Modal } from '@frakt/components/Modal';

import styles from './RefinanceModal.module.scss';
import { StatsValuesColumn } from '@frakt/components/StatsValues';
import { Button } from '@frakt/components/Button';
import { Loan } from '@frakt/api/loans';
import {
  DashboardColumnValue,
  VALUES_TYPES,
} from '@frakt/pages/DashboardPage/components/DashboardStatsValues';
import classNames from 'classnames';

interface RefinanceModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  loan: Loan;
}

const RefinanceModal: FC<RefinanceModalProps> = ({
  visible,
  onCancel,
  loan,
  onSubmit,
}) => {
  return (
    <Modal
      open={!!visible}
      centered
      onCancel={onCancel}
      width={485}
      footer={false}
      closable={false}
      className={styles.modal}
      closeIcon
    >
      <div className={styles.content}>
        <div className={classNames(styles.loanInfoWrapper, styles.prevLoan)}>
          <h4 className={styles.title}>Current loan</h4>
          <div className={styles.loanStats}>
            <DashboardColumnValue
              label="Borrowed"
              value={loan?.loanValue / 1e9}
              valueType={VALUES_TYPES.solPrice}
              reverse
            />
            <DashboardColumnValue
              label="Debt"
              value={loan?.repayValue / 1e9}
              reverse
            />
            <DashboardColumnValue
              label="Duration"
              value={0}
              valueType={VALUES_TYPES.string}
              reverse
            />
          </div>
        </div>
        <div className={styles.loanInfoWrapper}>
          <h4 className={styles.title}>New loan</h4>
          <div className={styles.loanStats}>
            <DashboardColumnValue label="Borrowed" value={13.78} reverse />
            <DashboardColumnValue label="Debt" value={14.78} reverse />
            <DashboardColumnValue
              label="Duration"
              value={0}
              valueType={VALUES_TYPES.string}
              reverse
            />
          </div>
        </div>
        <div className={styles.loanDifferenceWrapper}>
          <DashboardColumnValue
            label="Difference you will pay"
            value={-13.78}
            reverse
          />
        </div>
        <Button onClick={onSubmit} type="secondary" className={styles.button}>
          Extend
        </Button>
      </div>
    </Modal>
  );
};

export default RefinanceModal;
