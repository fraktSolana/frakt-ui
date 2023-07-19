import { FC } from 'react';

import { Loader } from '@frakt/components/Loader';

import { AppLayout } from '../../components/Layout/AppLayout';
import EmptyList from '@frakt/components/EmptyList';
import { PoolsTable } from './components/PoolsTable';
import Header from './components/Header';
import { usePoolsPage } from './hooks';

import styles from './PoolsPage.module.scss';

const PoolsPage: FC = () => {
  const {
    pools,
    loading,
    sortParams,
    toggleParams,
    totalDeposited,
    totalRewards,
  } = usePoolsPage();

  return (
    <AppLayout>
      <Header totalDeposited={totalDeposited} totalRewards={totalRewards} />
      <div className={styles.content}>
        <PoolsTable
          sortParams={sortParams}
          className={styles.rootTable}
          data={pools}
          toggleParams={toggleParams}
          classNameSortView={styles.sortView}
        />
        {loading && !pools?.length && <Loader className={styles.loader} />}
        {!loading && !pools?.length && (
          <EmptyList
            className={styles.emptyList}
            text="You don't have deposited pools"
          />
        )}
      </div>
    </AppLayout>
  );
};

export default PoolsPage;
