import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NavLink } from 'react-router-dom';

import { useMaxBorrowValue } from '@frakt/pages/BorrowPages/BorrowRootPage/hooks';
import Button from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';
import { Solana } from '@frakt/icons';

import styles from './AvailableBorrow.module.scss';
import classNames from 'classnames';

import Block from '../Block';

const AvailableBorrow: FC = () => {
  const { publicKey, connected } = useWallet();

  const { maxBorrowValue } = useMaxBorrowValue({ walletPublicKey: publicKey });

  return (
    <Block
      className={classNames(styles.block, {
        [styles.noConnectedBlock]: !connected,
      })}
    >
      <h3 className={styles.title}>Available to borrow</h3>
      {connected ? (
        <>
          <div className={styles.valueWrapper}>
            <p className={styles.value}>{(maxBorrowValue || 0)?.toFixed(2)}</p>
            <Solana className={styles.icon} />
          </div>
          <NavLink style={{ width: '100%' }} to={PATHS.BORROW_ROOT}>
            <Button className={styles.btn} type="secondary">
              Borrow
            </Button>
          </NavLink>
        </>
      ) : (
        <p className={styles.noConnectedMessage}>
          Please connect wallet to check how much SOL you can borrow
        </p>
      )}
    </Block>
  );
};

export default AvailableBorrow;
