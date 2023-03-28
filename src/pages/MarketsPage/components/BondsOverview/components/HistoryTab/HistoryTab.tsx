import { FC, useEffect, useState } from 'react';

import { useIntersection } from '@frakt/hooks/useIntersection';
import { Loader } from '@frakt/components/Loader';
import Toggle from '@frakt/components/Toggle';

import { useBondsSort, useFetchAllBonds } from '../BondsTab/hooks';

import { RadioButton, RBOption } from '@frakt/components/RadioButton';

import { HISTORY_FILTER_OPTIONS as options } from './constants';
import { HistoryTable } from '../HistoryTable';

import styles from './HistoryTab.module.scss';

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

  const [filterOption, setFilterOption] = useState<string>(options[0].label);

  const onChangeFilterOption = (nextOption: RBOption<string>) => {
    setFilterOption(nextOption.value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.bondsTableHeader}>
        <div className={styles.radio}>
          <RadioButton
            currentOption={{
              label: filterOption,
              value: filterOption,
            }}
            onOptionChange={onChangeFilterOption}
            options={options}
            className={styles.radioButton}
          />
        </div>
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
