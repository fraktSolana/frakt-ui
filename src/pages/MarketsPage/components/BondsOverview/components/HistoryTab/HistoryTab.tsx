import { FC, useEffect } from 'react';

import { useIntersection } from '@frakt/hooks/useIntersection';
import { Loader } from '@frakt/components/Loader';
import Toggle from '@frakt/components/Toggle';

import { useBondsSort, useFetchAllBonds } from '../../hooks';

import styles from './HistoryTab.module.scss';
import { HistoryTable } from '../HistoryTable';

const HistoryTab: FC = () => {
  const { ref, inView } = useIntersection();
  const { queryData } = useBondsSort();

  const {
    data: bonds,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
  } = useFetchAllBonds({ queryData });

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.bondsTableHeader}>
        <Toggle className={styles.toggle} label="My history only" />
      </div>
      <HistoryTable
        className={styles.table}
        data={bonds}
        breakpoints={{ scrollX: 744 }}
      />
      {!!isFetchingNextPage && <Loader />}
      <div ref={ref} />
    </div>
  );
};

export default HistoryTab;
