import { useState } from 'react';
import classNames from 'classnames';
import { ColumnsType } from 'antd/es/table';
import { DebouncedFunc, isEmpty } from 'lodash';

import { SortDropdown } from '@frakt/components/SortDropdown';
import Toggle from '@frakt/components/Toggle';
import Button from '@frakt/components/Button';
import {
  SearchSelect,
  SearchSelectProps,
} from '@frakt/components/SearchSelect';

import { switchButtonConfigurations } from './constants';
import { SortParams, ToggleParams } from '../../types';
import { Search } from '../../components/Search';
import { parseTableColumn } from './helpers';
import { useTableView } from '../../hooks';

import styles from './SortView.module.scss';

interface SortViewProps<T> {
  columns: ColumnsType<T>;
  search?: {
    placeHolderText?: string;
    onChange: DebouncedFunc<
      (event: React.ChangeEvent<HTMLInputElement>) => void
    >;
  };
  sortParams: SortParams;
  showSearching?: boolean;
  searchSelectParams?: SearchSelectProps<T>;
  toggleParams?: ToggleParams;
  classNameSortView?: string;
}

type ViewState = 'card' | 'table';

const SortView = <T extends unknown>({
  columns,
  search,
  sortParams,
  showSearching = false,
  searchSelectParams,
  toggleParams,
  classNameSortView,
}: SortViewProps<T>) => {
  const { viewState, setViewState } = useTableView();

  const [collapsed, setCollapsed] = useState<boolean>(true);

  const sortableColumns = columns.filter(({ sorter }) => !!sorter);
  const sortDropdownOptions = sortableColumns.map(parseTableColumn);

  const shouldShowSearchSelect = !isEmpty(searchSelectParams);
  const shouldShowContent = shouldShowSearchSelect ? collapsed : true;

  const handleViewStateChange = (state: ViewState) => {
    setViewState(state);
  };

  return (
    <div className={classNames(styles.sortWrapper, classNameSortView)}>
      {showSearching && <Search {...search} className={styles.searchInput} />}

      {shouldShowSearchSelect && (
        <SearchSelect
          collapsed={collapsed}
          onChangeCollapsed={setCollapsed}
          className={styles.searchSelect}
          {...searchSelectParams}
        />
      )}
      {shouldShowContent && (
        <div className={styles.rowGap}>
          <SwitchModeButtons
            onChange={handleViewStateChange}
            viewState={viewState}
          />
          {!!toggleParams?.onChange && <Toggle {...toggleParams} />}
          {!isEmpty(sortParams) && (
            <SortDropdown {...sortParams} options={sortDropdownOptions} />
          )}
        </div>
      )}
    </div>
  );
};

export default SortView;

const SwitchModeButtons = ({ viewState = 'table', onChange = null }) => (
  <div className={styles.switchButtons}>
    {switchButtonConfigurations.map((config) => (
      <Button
        key={config.state}
        className={classNames(styles.switchViewButton, {
          [styles.active]: viewState === config.state,
        })}
        onClick={() => onChange(config.state)}
        type="tertiary"
      >
        {config.icon}
      </Button>
    ))}
  </div>
);
