import { FC } from 'react';

import { usePoolModal } from './hooks/usePoolModal';
import WithdrawTab from './WithdrawTab';
import DepositTab from './DepositTab';
import { Tabs } from '../Tabs';
import { TabsNames } from './types';
import ModalPortal from '../ModalPortal';
import styles from './PoolModalStrategy.module.scss';

interface PoolModalStrategyProps {
  visible: string;
  onCancel: () => void;
  depositYield: number;
  depositAmount: number;
  utilizationRate: number;
  liquidityPoolPubkey: string;
  onClick?: () => void;
  tradePool: any;
}

export const PoolModalStrategy: FC<PoolModalStrategyProps> = ({
  visible,
  onCancel,
  depositYield,
  depositAmount = 0,
  utilizationRate,
  liquidityPoolPubkey,
  onClick,
  tradePool,
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
            tradePool={tradePool}
            utilizationRate={utilizationRate}
            depositAmount={depositAmount}
            onCancel={onCancel}
            depositYield={depositYield}
          />
        )}
        {tabValue === TabsNames.WITHDRAW && (
          <WithdrawTab
            tradePool={tradePool}
            onCancel={onCancel}
            depositAmount={depositAmount}
          />
        )}
      </div>
    </ModalPortal>
  );
};
