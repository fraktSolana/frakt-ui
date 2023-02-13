import { FC } from 'react';

import { TokenFieldWithBalance } from '../../TokenField';
import { Slider } from '../../Slider';
import Button from '../../Button';
import { SOL_TOKEN } from '../../../utils';
import { marks, useDepositTxn, usePoolModal } from '../hooks';
import styles from './WithdrawTab.module.scss';

interface WithdrawTabProps {
  depositAmount: number;
  liquidityPoolPubkey: string;
  onCancel: () => void;
}

const WithdrawTab: FC<WithdrawTabProps> = ({
  depositAmount,
  liquidityPoolPubkey,
  onCancel,
}) => {
  const {
    withdrawValue,
    percentValue,
    onWithdrawValueChange,
    onWithdrawPercentChange,
    onClearDepositValue,
  } = usePoolModal({ depositAmount });

  const { unstakeLiquidity } = useDepositTxn({
    onClearDepositValue,
    liquidityPoolPubkey,
    withdrawValue,
    onCancel,
  });

  const notEnoughDepositError = depositAmount < Number(withdrawValue);

  const isDisabledWithdrawBtn =
    Number(withdrawValue) === 0 || notEnoughDepositError;

  return (
    <div className={styles.wrapper}>
      <div>
        <TokenFieldWithBalance
          value={withdrawValue}
          onValueChange={onWithdrawValueChange}
          currentToken={SOL_TOKEN}
          label={`Your deposit:`}
          lpBalance={depositAmount}
          error={notEnoughDepositError}
          className={styles.input}
          showMaxButton
          labelRight
        />
        <div className={styles.errors}>
          {notEnoughDepositError && <p>Not enough SOL</p>}
        </div>
        <Slider
          value={percentValue}
          setValue={depositAmount && onWithdrawPercentChange}
          className={styles.slider}
          marks={marks}
          withTooltip
          step={1}
        />
      </div>

      <Button
        onClick={unstakeLiquidity}
        className={styles.btn}
        type="secondary"
        disabled={isDisabledWithdrawBtn}
      >
        Withdraw
      </Button>
    </div>
  );
};

export default WithdrawTab;
