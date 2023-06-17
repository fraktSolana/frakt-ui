import { FC } from 'react';
import classNames from 'classnames';

import Button from '@frakt/components/Button';
import Checkbox from '@frakt/components/Checkbox';
import { useDialectWallet } from '@dialectlabs/react-sdk';

import styles from '../NotificationsSider.module.scss';
import { useNotificationsSider } from '../hooks';

export const SignMessageScreen: FC = () => {
  const { authorize } = useNotificationsSider();

  const {
    hardwareWalletForcedState: {
      get: hardwareWalletForcedState,
      set: setHardwareWalletForcedState,
    },
  } = useDialectWallet();

  return (
    <div className={classNames(styles.content, styles.contentCentered)}>
      <h3 className={styles.contentTitle} style={{ marginBottom: 8 }}>
        Please sign message
      </h3>
      <p className={styles.signMessageSubtitle}>to set up notifications</p>
      <Checkbox
        onChange={() => setHardwareWalletForcedState((prev) => !prev)}
        label="I use ledger"
        checked={hardwareWalletForcedState}
        className={styles.ledgerCheckbox}
      />
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
