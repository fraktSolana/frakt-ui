import { FC } from 'react';

// import { TokenFieldWithBalance } from '@frakt/components/TokenField';
import { Slider } from '@frakt/components/Slider';
// import { SOL_TOKEN } from '@frakt//utils';
import { Button } from '@frakt/components/Button';

import styles from './BulkForm.module.scss';

interface BulkFormProps {
  borrowValue: string;
  borrowPercentValue: number;
  onBorrowValueChange: (nextValue: string) => void;
  onBorrowPercentChange: (nextValue: number) => void;
  maxBorrowValue: number;
  onAfterChange?: (nextValue?: number) => void;
  isNotEnoughBalanceError?: boolean;
}

export const BulkForm: FC<BulkFormProps> = ({
  borrowValue,
  borrowPercentValue,
  onBorrowValueChange,
  onBorrowPercentChange,
  maxBorrowValue,
  isNotEnoughBalanceError = false,
  onAfterChange,
}) => {
  return (
    <div className={styles.root}>
      <Button
        onClick={() => {
          onBorrowValueChange(maxBorrowValue.toFixed(2));
          onAfterChange();
        }}
      >
        Use max
      </Button>
      <input
        type="number"
        value={borrowValue}
        onChange={({ target }) => onBorrowValueChange(target.value)}
        onBlur={() => onAfterChange()}
      />
      {/* <TokenFieldWithBalance
        className={styles.input}
        value={borrowValue}
        onValueChange={onBorrowValueChange}
        currentToken={SOL_TOKEN}
        label="Available to borrow:"
        lpBalance={parseFloat(maxBorrowValue?.toFixed(2))}
        showMaxButton
        error={isNotEnoughBalanceError}
        labelRight
      /> */}
      <div className={styles.errors}>
        {isNotEnoughBalanceError && <p>Not enough NFTs</p>}
      </div>

      <Slider
        value={borrowPercentValue}
        setValue={onBorrowPercentChange}
        onAfterChange={onAfterChange}
        className={styles.slider}
        withTooltip
      />
    </div>
  );
};
