import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';

import { commonActions } from '@frakt/state/common/actions';
import Button from '@frakt/components/Button';

import {
  DashboardColumnValue,
  VALUES_TYPES,
} from '../../../DashboardStatsValues';
import Heading from '../../../Heading';

import styles from './CollectionsInfo.module.scss';
import classNames from 'classnames';

const CollectionsInfo: FC<{ hiddenButton?: boolean }> = ({ hiddenButton }) => {
  const dispatch = useDispatch();
  const { connected } = useWallet();

  const openConnectWalleModal = () =>
    dispatch(commonActions.setWalletModal({ isVisible: true }));

  return (
    <div
      className={classNames(styles.wrapper, { [styles.primary]: connected })}
    >
      <Heading className={styles.title} title="Available to borrow" />
      <div className={styles.stats}>
        <DashboardColumnValue
          label="Collections whitelisted"
          valueType={VALUES_TYPES.string}
          value={198}
        />
        <DashboardColumnValue label="Total liquidity" value={198} />
      </div>
      {!hiddenButton && (
        <Button
          onClick={openConnectWalleModal}
          className={styles.button}
          type="secondary"
        >
          Connect wallet to borrow SOL
        </Button>
      )}
    </div>
  );
};

export default CollectionsInfo;
