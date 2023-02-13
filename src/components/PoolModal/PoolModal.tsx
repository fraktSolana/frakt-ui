import { FC } from 'react';

import { usePoolModal } from './hooks/usePoolModal';
import WithdrawTab from './WithdrawTab';
import DepositTab from './DepositTab';
import { Tabs } from '../Tabs';
import { TabsNames } from './types';
import ModalPortal from '../ModalPortal';
import styles from './PoolModal.module.scss';

interface PoolModalProps {
  visible: string;
  onCancel: () => void;
  apr: number;
  depositAmount: number;
  utilizationRate: number;
  liquidityPoolPubkey: string;
}

export const PoolModal: FC<PoolModalProps> = ({
  visible,
  onCancel,
  apr,
  depositAmount = 0,
  utilizationRate,
  liquidityPoolPubkey,
}) => {
  const { poolTabs, tabValue, setTabValue } = usePoolModal({
    visible,
    depositAmount,
  });

  return (
    <ModalPortal visible={!!visible} onCancel={onCancel}>
      <Tabs tabs={poolTabs} value={tabValue} setValue={setTabValue} />
      <div className={styles.content}>
        {tabValue === TabsNames.DEPOSIT && (
          <DepositTab
            liquidityPoolPubkey={liquidityPoolPubkey}
            utilizationRate={utilizationRate}
            depositAmount={depositAmount}
            onCancel={onCancel}
            apr={apr}
          />
        )}
        {tabValue === TabsNames.WITHDRAW && (
          <WithdrawTab
            liquidityPoolPubkey={liquidityPoolPubkey}
            onCancel={onCancel}
            depositAmount={depositAmount}
          />
        )}
      </div>
    </ModalPortal>
  );
};
