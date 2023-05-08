import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useMaxBorrowValue } from '@frakt/pages/BorrowPages/BorrowRootPage/hooks';
import { NavigationButton } from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';

import { DashboardColumnValue } from '../../../DashboardStatsValues';
import Heading from '../../../Heading';

import styles from './AvailableBorrow.module.scss';

const AvailableBorrow: FC = () => {
  const { publicKey } = useWallet();
  const { maxBorrowValue } = useMaxBorrowValue({ walletPublicKey: publicKey });

  return (
    <div className={styles.wrapper}>
      <Heading title="Borrow in bulk" />
      <div className={styles.stats}>
        <DashboardColumnValue label="Borrow up to" value={maxBorrowValue} />
        <DashboardColumnValue label="From your">
          <span className={styles.value}>
            567
            <p className={styles.sub}>nfts</p>
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

export default AvailableBorrow;
