import { useRef, useState } from 'react';
import { MinusOutlined, SearchOutlined } from '@ant-design/icons';
import { SelectProps } from 'antd/lib/select';
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
  ...props
}: SearchSelectProps<T>) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  const ref = useRef();
  useOnClickOutside(ref, () => setCollapsed(true));

  if (collapsed && collapsible)
    return <CollapsedContent onClick={() => setCollapsed(!collapsed)} />;

  return (
    <div className={styles.selectWrapper} ref={ref}>
      <PrefixInput
        onClick={() => setCollapsed(!collapsed)}
        collapsible={collapsible}
      />
      <Select
        value={selectedOptions}
        onChange={onFilterChange}
        mode="multiple"
        allowClear
        showSearch
        filterOption={filterOption}
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
