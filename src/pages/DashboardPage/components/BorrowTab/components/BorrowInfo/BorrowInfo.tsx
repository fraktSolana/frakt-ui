import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useMaxBorrowValue } from '@frakt/pages/BorrowPages/BorrowRootPage/hooks';
import { NavigationButton } from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';

import { DashboardColumnValue } from '../../../DashboardStatsValues';
import styles from './BorrowInfo.module.scss';

const BorrowInfo: FC = () => {
  const { publicKey } = useWallet();

  const { maxBorrowValue } = useMaxBorrowValue({ walletPublicKey: publicKey });

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Borrow in bulk</h3>
      <div className={styles.stats}>
        <DashboardColumnValue label="Borrow up to" value={maxBorrowValue} />
        <DashboardColumnValue label="From your">
          <span className={styles.value}>
            567
            <p>nfts</p>
          </span>
        </DashboardColumnValue>
      </div>
      <NavigationButton
        path={PATHS.BORROW_ROOT}
        className={styles.button}
        type="secondary"
      >
        Borrow $SOL in bulk
      </NavigationButton>
    </div>
  );
};

export default BorrowInfo;
