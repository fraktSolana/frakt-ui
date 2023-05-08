import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { commonActions } from '@frakt/state/common/actions';
import Button from '@frakt/components/Button';

import { DashboardColumnValue } from '../../../DashboardStatsValues';
import Heading from '../../../Heading';

import styles from './CollectionsInfo.module.scss';

const CollectionsInfo: FC = () => {
  const dispatch = useDispatch();

  const openConnectWalleModal = () =>
    dispatch(commonActions.setWalletModal({ isVisible: true }));

  return (
    <div className={styles.wrapper}>
      <Heading className={styles.title} title="Available to borrow" />
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

export default CollectionsInfo;
