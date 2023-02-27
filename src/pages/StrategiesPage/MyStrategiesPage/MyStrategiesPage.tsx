import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import AdminButton from '../components/AdminButton';
import Titles from '@frakt/components/Titles';
import Strategies from '../components/Strategies';
import { SearchInput } from '@frakt/components/SearchInput';

import styles from '../StrategiesPage.module.scss';
import { useHistory } from 'react-router-dom';
import { useAdminTradePools } from '@frakt/utils/Strategies/hooks';
import { createTradePools } from '@frakt/api/strategies';
import { Loader } from '@frakt/components/Loader';

const MyStrategiesPage: FC = () => {
  const wallet = useWallet();
  const history = useHistory();

  const adminsList = ['GAHb7LbGXx41HEMHY46qDM65VmrXWYJjs5fPJU2iXzo5'];

  const { tradePoolsAdmin, isLoading } = useAdminTradePools({
    walletPublicKey: wallet?.publicKey?.toBase58(),
  });

  console.log('tradePoolsAdmin', tradePoolsAdmin);

  // const isAdmin = adminsList.includes(wallet?.publicKey?.toBase58());
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
