import { FC } from 'react';

import { Slider } from '@frakt/components/Slider';
import { Button } from '@frakt/components/Button';

import styles from './SuggestionPicker.module.scss';

interface SuggestionPickerProps {
  value: string;
  percentValue: number;
  onValueChange: (nextValue: string) => void;
  onPercentChange: (nextValue: number) => void;
  maxValue: number;
  onAfterChange?: (nextValue?: number) => void;
  isNotEnoughBalanceError?: boolean;
}

export const SuggestionPicker: FC<SuggestionPickerProps> = ({
  value,
  percentValue,
  onValueChange,
  onPercentChange,
  maxValue,
  isNotEnoughBalanceError = false,
  onAfterChange,
}) => {
  return (
    <div className={styles.root}>
      <p>Max: {maxValue.toFixed(2)}</p>
      <Button
        onClick={() => {
          onValueChange(maxValue.toFixed(2));
          onAfterChange();
        }}
      >
        Use max
      </Button>
      <input
        type="number"
        value={value}
        onChange={({ target }) => onValueChange(target.value)}
        onBlur={() => onAfterChange()}
      />
      <div className={styles.errors}>
        {isNotEnoughBalanceError && <p>Not enough NFTs</p>}
      </div>
      <Slider
        value={percentValue}
        setValue={onPercentChange}
        onAfterChange={onAfterChange}
        className={styles.slider}
        withTooltip
      />
    </div>
  );
};
