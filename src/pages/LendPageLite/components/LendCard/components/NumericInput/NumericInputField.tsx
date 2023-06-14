import { FC } from 'react';

import styles from './NumericInputField.module.scss';
import NumericInput from '@frakt/components/NumericInput';
import classNames from 'classnames';

interface NumericInputFieldProps {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  className?: string;
  showIcon?: boolean;
  rightLabel?: string | JSX.Element;
  integerOnly?: boolean;
}

const NumericInputField: FC<NumericInputFieldProps> = ({
  value,
  onChange,
  placeholder,
  label,
  className,
  showIcon = true,
  integerOnly = false,
  rightLabel,
}) => {
  return (
    <div className={classNames(styles.field, className)}>
      <div className={styles.labelsWrapper}>
        <span className={styles.label}>{label}</span>
        {rightLabel && <span className={styles.rightLabel}>{rightLabel}</span>}
      </div>
      <div className={styles.root}>
        <NumericInput
          value={value}
          integerOnly={integerOnly}
          onChange={onChange}
          placeholder={placeholder}
          positiveOnly
          className={classNames([styles.valueInput])}
        />
        <div>{showIcon && <div className={styles.selectTokenBtn}>◎</div>}</div>
      </div>
    </div>
  );
};

export default NumericInputField;
