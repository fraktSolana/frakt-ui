import { FC, CSSProperties } from 'react';

import { Slider } from '@frakt/components/Slider';
import { Button } from '@frakt/components/Button';

import styles from './SuggestionPicker.module.scss';
import classNames from 'classnames';
import NumericInput from '@frakt/components/NumericInput';

interface SuggestionPickerProps {
  value: string;
  percentValue: number;
  onValueChange: (nextValue: string) => void;
  onPercentChange: (nextValue: number) => void;
  maxValue: number;
  onAfterChange?: (nextValue?: number) => void;
  className?: string;
  style?: CSSProperties;
}

export const SuggestionPicker: FC<SuggestionPickerProps> = ({
  value,
  percentValue,
  onValueChange,
  onPercentChange,
  maxValue,
  onAfterChange,
  className,
  style,
}) => {
  return (
    <div className={classNames(styles.root, className)} style={style}>
      <Slider
        value={percentValue}
        setValue={onPercentChange}
        onAfterChange={onAfterChange}
        className={styles.slider}
      />
      <div className={styles.inputWrapper}>
        <Button
          className={styles.maxBtn}
          type="secondary"
          onClick={() => {
            onValueChange(maxValue.toFixed(2));
            onAfterChange();
          }}
        >
          Max: {maxValue.toFixed(2)}
        </Button>

        <NumericInput
          onBlur={() => {
            if (parseFloat(value) > maxValue) {
              onValueChange(maxValue.toFixed(2));
            }
            onAfterChange();
          }}
          value={value}
          onChange={(value) => onValueChange(value)}
          positiveOnly
        />
      </div>
    </div>
  );
};
