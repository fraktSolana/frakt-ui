import { FC } from 'react';
import classNames from 'classnames';

import { RBOption, RadioButton } from '@frakt/components/RadioButton';
import Tooltip from '@frakt/components/Tooltip';

import styles from './RadioButtonField.module.scss';

interface RadioButtonFieldProps<T> {
  className?: string;
  currentOption: RBOption<T>;
  options: RBOption<T>[];
  disabled?: boolean;
  onOptionChange: (nextOption: RBOption<T>) => void;
  tooltipText?: string;
  label: string;
}

const RadioButtonField = <T extends unknown>({
  className,
  currentOption,
  options,
  disabled,
  onOptionChange,
  tooltipText,
  label,
}: RadioButtonFieldProps<T>): JSX.Element => {
  return (
    <div className={classNames(styles.radio, className)}>
      <div className={styles.radioTitle}>
        <h6 className={styles.subtitle}>{label}</h6>
        {!!tooltipText && <Tooltip placement="bottom" overlay={tooltipText} />}
      </div>
      <RadioButton
        currentOption={currentOption}
        disabled={disabled}
        onOptionChange={onOptionChange}
        options={options}
      />
    </div>
  );
};

export default RadioButtonField;
