import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useMaxBorrowValue } from '@frakt/pages/BorrowPages/BorrowRootPage/hooks';
import Button from '@frakt/components/Button';

import styles from './AvailableBorrow.module.scss';

const AvailableBorrow: FC = () => {
  const { connected, publicKey } = useWallet();

  const { maxBorrowValue } = useMaxBorrowValue({ walletPublicKey: publicKey });

  return (
    <div className={styles.wrapper}>
      {/* <h3 className={styles.title}>Available to borrow</h3> */}
      {connected && (
        <StatsValue label="You can borrow" value={maxBorrowValue} />
      )}

      {!connected && <StatsValue label="Collections whitelisted" value={198} />}
      <Button className={styles.button} type="secondary">
        Connect wallet to borrow SOL
      </Button>
    </div>
  );
};

export default AvailableBorrow;

const StatsValue = ({ label, value }) => (
  <div className={styles.column}>
    <p className={styles.label}>{label}</p>
    <p className={styles.value}>{value}</p>
  </div>
);
