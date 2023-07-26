import { FC, PropsWithChildren } from 'react';
import classNames from 'classnames';

import { Minus, Plus } from '@frakt/icons';

import { useInputCounter } from './hooks';
import NumericInput from '../NumericInput';

import styles from './InputCounter.module.scss';

interface NumericInputFieldProps {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  className?: string;
}

const InputCounter: FC<NumericInputFieldProps> = ({
  value,
  onChange,
  placeholder = '0',
  label,
  className,
}) => {
  const { increaseValue, decreaseValue, isValueGreaterThanOne } =
    useInputCounter(value, onChange);

  return (
    <div className={classNames(styles.field, className)}>
      <span className={styles.label}>{label}</span>
      <div className={styles.root}>
        <CounterButton
          disabled={!isValueGreaterThanOne}
          onClick={decreaseValue}
        >
          <Minus />
        </CounterButton>

        <NumericInput
          className={styles.valueInput}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          maxLength={4}
          positiveOnly
          integerOnly
        />

        <CounterButton onClick={increaseValue}>
          <Plus />
        </CounterButton>
      </div>
    </div>
  );
};

export default InputCounter;

interface CounterButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const CounterButton: FC<PropsWithChildren<CounterButtonProps>> = ({
  onClick,
  children,
  disabled,
}) => (
  <div
    onClick={onClick}
    className={classNames(styles.counterButton, {
      [styles.disabled]: disabled,
    })}
  >
    {children}
  </div>
);
