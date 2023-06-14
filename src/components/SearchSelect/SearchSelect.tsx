import { MinusOutlined, SearchOutlined } from '@ant-design/icons';
import { DefaultOptionType, SelectProps } from 'antd/lib/select';
import { Select } from 'antd';

import { Close } from '@frakt/icons';

import { filterOption, getPopupContainer } from './helpers';
import { OptionKeys, renderOption } from './Option';
import { useSelectedOptions } from './hooks';

import styles from './SearchSelect.module.scss';

export interface SearchSelectProps<T> extends SelectProps<T, unknown> {
  options?: T[];
  loading?: boolean;
  optionKeys: OptionKeys;
  placeholder?: string;
  onFilterChange?: (values: string[]) => void;
}

type SelectChangeHandler<T> = (
  value: T,
  option: DefaultOptionType | DefaultOptionType[],
) => void;

export const SearchSelect = <T extends {}>({
  options = [],
  loading = false,
  optionKeys,
  placeholder,
  onFilterChange,
  ...props
}: SearchSelectProps<T>) => {
  const { selectedOptions, handleSelectChange } = useSelectedOptions({
    onFilterChange,
  });

  const handleChange: SelectChangeHandler<T> =
    handleSelectChange as unknown as SelectChangeHandler<T>;

  return (
    <div className={styles.selectWrapper}>
      <PrefixInput />
      <Select
        onChange={handleChange}
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
            <SelectLabels />
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

const SelectLabels = () => (
  <div className={styles.labels}>
    <span>Collection name</span>
    <span>Apr</span>
  </div>
);
