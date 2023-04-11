import { FC, useState } from 'react';
import classNames from 'classnames';
import NumericInput from '../NumericInput';
import Tooltip from '../Tooltip';
import { Solana } from '@frakt/icons';
import { ClockCircleOutlined } from '@ant-design/icons';

import styles from './InputField.module.scss';

export interface TokenFieldProps {
  value: string;
  unit?: '%' | 'sec' | 'SOL' | 'bSOL';
  onValueChange: (nextValue: string) => void;
  label?: string;
  className?: string;
  error?: boolean;
  placeholder?: string;
  amountMaxLength?: number;
  disabled?: boolean;
  toolTipText?: string;
}

const InputField: FC<TokenFieldProps> = ({
  unit,
  value,
  onValueChange,
  label,
  className,
  error,
  amountMaxLength,
  placeholder = '0.0',
  disabled = false,
  toolTipText,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const unitIcons = {
    ['sec']: <ClockCircleOutlined />,
    ['SOL']: <Solana width={16} />,
    ['%']: null,
  };

  return (
    <div
      className={classNames(styles.wrapper, [
        { [styles.focused]: isFocused },
        { [styles.error]: error },
      ])}
    >
      {!!label && (
        <div className={styles.label}>
          {label}
          {toolTipText && <Tooltip placement="bottom" overlay={toolTipText} />}
        </div>
      )}

      <div
        className={classNames([styles.root, className])}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <NumericInput
          value={value}
          maxLength={amountMaxLength}
          onChange={onValueChange}
          placeholder={placeholder}
          positiveOnly
          className={classNames([
            styles.valueInput,
            { [styles.valueInput_disabled]: disabled },
          ])}
        />

        <div className={styles.unitField}>
          {unitIcons[unit]}
          <span className={styles.unitName}>{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default InputField;
