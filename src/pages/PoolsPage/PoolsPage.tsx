import { FC, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ControlledSelect } from '../../components/Select/Select';
import { ControlledToggle } from '../../components/Toggle/Toggle';
import { AppLayout } from '../../components/Layout/AppLayout';
import { SearchInput } from '../../components/SearchInput';
import { Container } from '../../components/Layout';
import { ArrowDownSmallIcon } from '../../icons';
import { useDebounce } from '../../hooks';
import styles from './styles.module.scss';
import Pool from './Pool';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll';
import { useLiquidityPools } from '../../contexts/liquidityPools';
import { useRaydiumPoolsInfo } from '../../utils/liquidityPools/liquidityPools.hooks';

const SORT_VALUES = [
  {
    label: (
      <span>
        Liquidity <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'liquidity_asc',
  },
  {
    label: (
      <span>
        Liquidity <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'liquidity_desc',
  },
  {
    label: (
      <span>
        Trading Vol. <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'trading_asc',
  },
  {
    label: (
      <span>
        Trading Vol. <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'trading_desc',
  },
  {
    label: (
      <span>
        APR <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'apr_asc',
  },
  {
    label: (
      <span>
        APR <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'apr_desc',
  },
];

const PoolsPage: FC = () => {
  const { control } = useForm({
    defaultValues: {
      showStaked: true,
      showAwarded: true,
      sort: SORT_VALUES[0],
    },
  });

  const [searchString, setSearchString] = useState<string>('');

  const { itemsToShow, next } = useFakeInfinityScroll(9);
  const { poolDataByMint, loading } = useLiquidityPools();

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const poolsConfigs = Array.from(poolDataByMint.values()).map(
    ({ poolConfig }) => poolConfig,
  );

  const { raydiumPoolInfo } = useRaydiumPoolsInfo(poolsConfigs, loading);

  const tokensList = Array.from(poolDataByMint.values());

  const filteredSWappableTokenList = useMemo(() => {
    return tokensList.filter(({ tokenInfo }) =>
      tokenInfo.symbol.toUpperCase().includes(searchString),
    );
  }, [tokensList, searchString]);

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <h1 className={styles.title}>Liquidity</h1>
        <div className={styles.sortWrapper}>
          <SearchInput
            size="large"
            onChange={(e) => searchItems(e.target.value || '')}
            className={styles.search}
            placeholder="Filter by symbol"
          />
          <div className={styles.filtersWrapper}>
            <div className={styles.filters}>
              <ControlledToggle
                control={control}
                name="showStaked"
                label="Staked only"
                className={styles.filter}
              />
              <ControlledToggle
                control={control}
                name="showAwarded"
                label="Awarded"
                className={styles.filter}
              />
            </div>
            <div>
              <ControlledSelect
                valueContainerClassName={styles.sortingSelectValueContainer}
                label="Sort by"
                control={control}
                name="sort"
                options={SORT_VALUES}
              />
            </div>
          </div>
        </div>
        <FakeInfinityScroll
          itemsToShow={itemsToShow}
          next={next}
          isLoading={loading}
          emptyMessage={'No Liquidity pool found'}
        >
          {filteredSWappableTokenList.map(({ tokenInfo }, id) => (
            <Pool
              key={id}
              quoteToken={tokenInfo}
              raydiumPoolInfo={raydiumPoolInfo[id]}
              activeId={id}
            />
          ))}
        </FakeInfinityScroll>
      </Container>
    </AppLayout>
  );
};

export default PoolsPage;
