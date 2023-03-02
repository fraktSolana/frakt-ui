import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import AdminButton from '../components/AdminButton';
import Titles from '@frakt/components/Titles';
import Strategies from '../components/Strategies';
import { SearchInput } from '@frakt/components/SearchInput';

import { Loader } from '@frakt/components/Loader';
import styles from '../StrategiesPage.module.scss';
import { useAdminTradePools } from '@frakt/utils/Strategies/hooks';

const MyStrategiesPage: FC = () => {
  const wallet = useWallet();

  const { tradePoolsAdmin, isLoading } = useAdminTradePools({
    walletPublicKey: wallet?.publicKey?.toBase58(),
  });

  return (
    <AppLayout>
      <Titles title="My Strategies" />
      {!isLoading && <AdminButton />}
      <div className={styles.sortWrapper}>
        <SearchInput
          className={styles.searchInput}
          placeholder="Search by strategy name"
        />
      </div>
      {isLoading && <Loader size="large" />}
      {!isLoading && <Strategies tradePools={tradePoolsAdmin} admin />}
    </AppLayout>
  );
};

export default MyStrategiesPage;
