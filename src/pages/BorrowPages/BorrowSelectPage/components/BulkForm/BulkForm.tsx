import { FC } from 'react';

import { TokenFieldWithBalance } from '@frakt/components/TokenField';
import { Slider } from '@frakt/components/Slider';
import { SOL_TOKEN } from '@frakt//utils';

import styles from './BulkForm.module.scss';
import { useBulkForm } from './hooks';

export const BulkForm: FC = () => {
  const {
    borrowValue,
    borrowPercentValue,
    onBorrowValueChange,
    onBorrowPercentChange,
    maxBorrowValue,
    loading,
    isNotEnoughBalanceError,
    isWalletConnected,
  } = useBulkForm();

  return (
    <>
      {isWalletConnected && !loading && (
        <div className={styles.block}>
          <div className={styles.blockContent}>
            <TokenFieldWithBalance
              className={styles.input}
              value={borrowValue}
              onValueChange={onBorrowValueChange}
              currentToken={SOL_TOKEN}
              label="Available to borrow:"
              lpBalance={parseFloat(maxBorrowValue?.toFixed(2))}
              showMaxButton
              error={isNotEnoughBalanceError}
              labelRight
            />
            <div className={styles.errors}>
              {isNotEnoughBalanceError && <p>Not enough NFTs</p>}
            </div>

            <Slider
              value={borrowPercentValue}
              setValue={onBorrowPercentChange}
              className={styles.slider}
              marks={{
                0: '0 %',
                25: '25 %',
                50: '50 %',
                75: '75 %',
                100: '100 %',
              }}
              withTooltip
            />
          </div>
        </div>
      )}
    </>
  );
};
