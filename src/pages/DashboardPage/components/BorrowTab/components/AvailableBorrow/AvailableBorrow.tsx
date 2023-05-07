import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { commonActions } from '@frakt/state/common/actions';
import Button from '@frakt/components/Button';

import { DashboardColumnValue } from '../../../DashboardStatsValues';

import styles from './AvailableBorrow.module.scss';

const AvailableBorrow: FC = () => {
  const dispatch = useDispatch();

  const openConnectWalleModal = () =>
    dispatch(commonActions.setWalletModal({ isVisible: true }));

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Available to borrow</h3>
      <div className={styles.stats}>
        <DashboardColumnValue label="Collections whitelisted" value={198} />
        <DashboardColumnValue label="Total liquidity" value={198} />
      </div>

      <Button
        onClick={openConnectWalleModal}
        className={styles.button}
        type="secondary"
      >
        Connect wallet to borrow SOL
      </Button>
    </div>
  );
};

export default AvailableBorrow;
