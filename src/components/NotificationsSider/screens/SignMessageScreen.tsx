import { FC, useEffect } from 'react';
import classNames from 'classnames';

import Button from '@frakt/components/Button';
import { useDialectWallet } from '@dialectlabs/react-sdk';
import { useIsLedger } from '@frakt/store';

import styles from '../NotificationsSider.module.scss';
import { useNotificationsSider } from '../hooks';

export const SignMessageScreen: FC = () => {
  const { authorize } = useNotificationsSider();

  const { isLedger } = useIsLedger();

  const {
    hardwareWalletForcedState: { set: setHardwareWalletForcedState },
  } = useDialectWallet();

  useEffect(() => {
    setHardwareWalletForcedState(isLedger);
  }, [isLedger, setHardwareWalletForcedState]);

  return (
    <div className={classNames(styles.content, styles.contentCentered)}>
      <h3 className={styles.contentTitle} style={{ marginBottom: 8 }}>
        Please sign message
      </h3>
      <p className={styles.signMessageSubtitle}>to set up notifications</p>
      <Button
        type="secondary"
        className={styles.signMessageBtn}
        onClick={authorize}
      >
        Sign
      </Button>
    </div>
  );
};
