import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { map, sum } from 'lodash';

import { Loader } from '@frakt/components/Loader';

import { AppLayout } from '../../components/Layout/AppLayout';
import { PoolsTable } from './components/PoolsTable';
import { useFetchLiquidityPools } from './hooks';
import Header from './components/Header';

import styles from './PoolsPage.module.scss';

const PoolsPage: FC = () => {
  const { publicKey: walletPublicKey } = useWallet();
  const { data: liquidityPools, loading } = useFetchLiquidityPools({
    walletPublicKey,
  });

  const totalDeposited = sum(
    map(liquidityPools, ({ userDeposit }) => userDeposit?.depositAmount),
  );

  const totalRewards = sum(
    map(liquidityPools, ({ userDeposit }) => userDeposit?.harvestAmount),
  );

  return (
    <AppLayout>
      <Header totalDeposited={totalDeposited} totalRewards={totalRewards} />
      <div className={styles.content}>
        {loading && !liquidityPools?.length && (
          <Loader className={styles.loader} />
        )}
        {!!liquidityPools?.length && (
          <PoolsTable className={styles.rootTable} data={liquidityPools} />
        )}
      </div>
    </AppLayout>
  );
};

export default PoolsPage;
