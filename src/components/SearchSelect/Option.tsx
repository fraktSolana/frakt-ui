import { FC } from 'react';
import { BaseOptionType } from 'antd/lib/select';
import { includes } from 'lodash';
import { Select } from 'antd';

import styles from './SearchSelect.module.scss';

export interface OptionKeys {
  labelKey: string;
  valueKey: string;
  secondLabelKey?: {
    key: string;
    format?: (value: number | string) => string;
  };
  imageKey?: string;
}

interface OptionProps {
  option: BaseOptionType;
  optionKeys?: OptionKeys;
  selectedOptions?: string[];
}

export const renderOption: FC<OptionProps> = ({
  option,
  optionKeys = {},
  selectedOptions = [],
}) => {
  const { labelKey, secondLabelKey, valueKey, imageKey } = optionKeys || {};

  const { [valueKey]: value, [labelKey]: label, [imageKey]: image } = option;

  const secondValue = option[secondLabelKey.key];

  const isOptionSelected = includes(selectedOptions, label);

  return (
    <Select.Option key={value} value={label}>
      <div className={styles.optionWrapper}>
        <div className={styles.flexRow}>
          <div
            className={styles.relativeImageContainer}
            id="relativeImageContainer"
          >
            {image && <img className={styles.image} src={image} />}
            {isOptionSelected && <div className={styles.selected} />}
          </div>
          <p className={styles.label}>{label}</p>
        </div>
        <SecondValue secondLabelKey={secondLabelKey} value={secondValue} />
      </div>
    </Select.Option>
  );
};

const SecondValue = ({ secondLabelKey, value }) => {
  if (!value) {
    return <p>--</p>;
  }

  const formattedValue = secondLabelKey.format
    ? secondLabelKey.format(value)
    : value;

  return <p className={styles.secondValue}>{formattedValue}</p>;
};
