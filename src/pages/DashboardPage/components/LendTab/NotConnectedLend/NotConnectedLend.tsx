import { FC } from 'react';

import { NavigationButton } from '@frakt/components/Button';
import { LiquidityPool } from '@frakt/state/loans/types';

import { PATHS } from '@frakt/constants';

import TopLendList from '../TopLendList';
import { LendCard } from '../../Cards';
import { Search } from '../../Search';
import Heading from '../../Heading';

import styles from './NotConnectedLend.module.scss';
import { useNotConnectedLend } from './hooks';

const NotConnectedLend: FC = () => {
  const { pools, strategies, allLiquidityPools, setSearch } =
    useNotConnectedLend();

  return (
    <div className={styles.container}>
      <div className={styles.searchableList}>
        <Search
          title="Lend"
          tooltipText="Lend"
          onChange={setSearch}
          className={styles.search}
        />
        <div className={styles.nftsList}>
          {allLiquidityPools.map((pool: LiquidityPool) => (
            <LendCard
              image={pool.imageUrl?.[0]}
              activeLoans={pool.activeloansAmount}
              amount={pool.totalLiquidity}
              apr={pool.depositApr}
            />
          ))}
        </div>
      </div>
      <div className={styles.content}>
        <LendListContentView
          data={strategies}
          title="Strategies"
          tooltipText="Strategies"
          path={PATHS.STRATEGIES}
        />
        <LendListContentView
          data={pools}
          title="Pools"
          tooltipText="Pools"
          path={PATHS.LEND}
        />
      </div>
    </div>
  );
};

export default NotConnectedLend;

const LendListContentView = ({ data, path, title, tooltipText }) => {
  return (
    <div className={styles.wrapper}>
      <Heading title={title} tooltipText={tooltipText} />
      <TopLendList data={data} isLoading={false} />
      <NavigationButton className={styles.button} path={path}>
        See all
      </NavigationButton>
    </div>
  );
};
