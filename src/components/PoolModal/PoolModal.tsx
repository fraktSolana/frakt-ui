import { FC } from 'react';

import { usePoolModal } from './hooks/usePoolModal';
import { CloseModal } from '@frakt/icons';
import styles from './PoolModal.module.scss';
import WithdrawTab from './WithdrawTab';
import DepositTab from './DepositTab';
import { Tabs } from '../Tabs';
import { Modal } from '../Modal';
import { TabsNames } from './types';

interface PoolModalProps {
  tradePool?: boolean;
  visible: string;
  onCancel: () => void;
  depositAmount: number;
  utilizationRate: number;
  poolPubkey: string;
  depositYield: number;
}

export const PoolModal: FC<PoolModalProps> = ({
  tradePool,
  visible,
  onCancel,
  depositAmount = 0,
  utilizationRate,
  poolPubkey,
  depositYield,
}) => {
  const { poolTabs, tabValue, setTabValue } = usePoolModal({
    visible,
    depositAmount,
  });

  return (
    <Modal
      open={!!visible}
      centered
      onCancel={onCancel}
      width={500}
      footer={false}
      closable={false}
      className={styles.modal}
    >
      <div className={styles.closeModalSection}>
        <div className={styles.closeModalIcon} onClick={onCancel}>
          <CloseModal className={styles.closeIcon} />
        </div>
      </div>

      <Tabs
        className={styles.tabs}
        tabs={poolTabs}
        value={tabValue}
        setValue={setTabValue}
      />
      <div className={styles.content}>
        {tabValue === TabsNames.DEPOSIT && (
          <DepositTab
            tradePool={tradePool}
            poolPubkey={poolPubkey}
            utilizationRate={utilizationRate}
            depositAmount={depositAmount}
            onCancel={onCancel}
            depositYield={depositYield}
          />
        )}
        {tabValue === TabsNames.WITHDRAW && (
          <WithdrawTab
            tradePool={tradePool}
            poolPubkey={poolPubkey}
            onCancel={onCancel}
            depositAmount={depositAmount}
          />
        )}
      </div>
    </Modal>
  );
};
