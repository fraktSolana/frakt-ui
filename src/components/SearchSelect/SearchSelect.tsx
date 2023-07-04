import { MinusOutlined, SearchOutlined } from '@ant-design/icons';
import { SelectProps } from 'antd/lib/select';
import { Select } from 'antd';

import { Close } from '@frakt/icons';

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
}

export const SearchSelect = <T extends {}>({
  options = [],
  loading = false,
  optionKeys,
  placeholder,
  onFilterChange,
  selectedOptions,
  labels,
  ...props
}: SearchSelectProps<T>) => {
  return (
    <div className={styles.selectWrapper}>
      <PrefixInput />
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

const PrefixInput = () => (
  <div className={styles.prefix}>
    <SearchOutlined />
  </div>
);

const SelectLabels = ({ labels = [] }) => (
  <div className={styles.labels}>
    {labels.map((label) => (
      <span>{label}</span>
    ))}
  </div>
);
