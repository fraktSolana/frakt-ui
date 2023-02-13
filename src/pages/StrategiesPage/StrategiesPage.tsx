import { FC } from 'react';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import Titles from '@frakt/components/Titles';
import { SearchInput } from '@frakt/components/SearchInput';
import Strategies from './components/Strategies';

import styles from './StrategiesPage.module.scss';

const StrategiesPage: FC = () => {
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

      <Strategies />
    </AppLayout>
  );
};

export default StrategiesPage;
