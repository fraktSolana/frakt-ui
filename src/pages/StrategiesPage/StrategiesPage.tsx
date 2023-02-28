import { FC } from 'react';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import Titles from '@frakt/components/Titles';
import { SearchInput } from '@frakt/components/SearchInput';
import Strategies from './components/Strategies';

import styles from './StrategiesPage.module.scss';
import { useTradePools } from '@frakt/utils/Strategies/hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader } from '@frakt/components/Loader';

const StrategiesPage: FC = () => {
  const wallet = useWallet();
  const { tradePools, isLoading } = useTradePools({
    walletPublicKey: wallet?.publicKey?.toBase58(),
  });

  return (
    <AppLayout>
      <Titles
        title="Strategies"
        subtitle="Earn instant yield on SOL deposits"
      />

      <div className={styles.sortWrapper}>
        <SearchInput
          className={styles.searchInput}
          placeholder="Search by strategy name"
        />
      </div>

      {isLoading && <Loader size="large" />}
      {!isLoading && <Strategies tradePools={tradePools} />}
    </AppLayout>
  );
};

export default StrategiesPage;
