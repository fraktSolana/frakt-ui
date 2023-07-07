import { useRef } from 'react';
import { MinusOutlined } from '@ant-design/icons';
import { SelectProps } from 'antd/lib/select';
import classNames from 'classnames';
import { Select } from 'antd';

import { useOnClickOutside } from '@frakt/hooks';
import { Close } from '@frakt/icons';

import { CollapsedContent, PrefixInput, SelectLabels } from './components';
import { filterOption, getPopupContainer } from './helpers';
import { OptionKeys, renderOption } from './Option';

import styles from './SearchSelect.module.scss';

export interface SearchSelectProps<T> extends SelectProps<T, unknown> {
  options?: T[];
  loading?: boolean;
  optionKeys: OptionKeys;
  placeholder?: string;
  onFilterChange?: (values: string[]) => void;
  selectedOptions: string[];
  labels?: string[];
  collapsible?: boolean;
  collapsed?: boolean;
  onChangeCollapsed?: (value: boolean) => void;
}

export const SearchSelect = <T extends {}>({
  options = [],
  loading = false,
  optionKeys,
  placeholder,
  onFilterChange,
  selectedOptions,
  labels,
  collapsible = false,
  collapsed,
  onChangeCollapsed,
  className,
  ...props
}: SearchSelectProps<T>) => {
  const ref = useRef();

  useOnClickOutside(
    ref,
    onChangeCollapsed ? () => onChangeCollapsed(true) : () => {},
  );

  if (collapsed && collapsible)
    return (
      <CollapsedContent
        selectedOptions={selectedOptions}
        onClick={() => onChangeCollapsed(!collapsed)}
      />
    );

  return (
    <div className={classNames(styles.selectWrapper, className)} ref={ref}>
      <PrefixInput
        onClick={() => onChangeCollapsed(!collapsed)}
        collapsible={collapsible}
      />
      <Select
        value={selectedOptions}
        onChange={onFilterChange}
        mode="multiple"
        allowClear
        showSearch
        filterOption={filterOption}
        defaultOpen={!collapsed && collapsible}
        placeholder={placeholder}
        notFoundContent={null}
        className={styles.root}
        popupClassName={styles.popup}
        getPopupContainer={getPopupContainer}
        removeIcon={<MinusOutlined />}
        clearIcon={<Close />}
        {...props}
        dropdownRender={(menu) => (
          <>
            <SelectLabels labels={labels} />
            {menu}
          </>
        )}
      >
        {options.map((option) =>
          renderOption({ option, optionKeys, selectedOptions }),
        )}
      </Select>
    </div>
  );
};
