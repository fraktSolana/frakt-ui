import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import AdminButton from '../components/AdminButton';
import Titles from '@frakt/components/Titles';
import Strategies from '../components/Strategies';
import { SearchInput } from '@frakt/components/SearchInput';

import styles from '../StrategiesPage.module.scss';
import { useHistory } from 'react-router-dom';

const MyStrategiesPage: FC = () => {
  const { publicKey } = useWallet();
  const history = useHistory();

  const adminsList = ['GAHb7LbGXx41HEMHY46qDM65VmrXWYJjs5fPJU2iXzo5'];

  const isAdmin = adminsList.includes(publicKey?.toBase58());
  return (
    isAdmin && (
      <AppLayout>
        <Titles title="My Strategies" />
        <AdminButton />
        <div className={styles.sortWrapper}>
          <SearchInput
            className={styles.searchInput}
            placeholder="Search by strategy name"
          />
        </div>
        <Strategies />
      </AppLayout>
    )
  );
};

export default MyStrategiesPage;
