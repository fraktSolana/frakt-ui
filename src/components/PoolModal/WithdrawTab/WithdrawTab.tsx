import { FC } from 'react';

import { marks, useDepositTxn, usePoolModal } from '../hooks';
import { TokenFieldWithBalance } from '../../TokenField';
import styles from './WithdrawTab.module.scss';
import { SOL_TOKEN } from '../../../utils';
import { Slider } from '../../Slider';
import Button from '../../Button';
import { useWithdraw } from '@frakt/utils/strategies';

interface WithdrawTabProps {
  tradePool?: boolean;
  depositAmount: number;
  poolPubkey: string;
  onCancel: () => void;
}

const WithdrawTab: FC<WithdrawTabProps> = ({
  tradePool,
  depositAmount,
  poolPubkey,
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
    poolPubkey,
    withdrawValue,
    onCancel,
  });

  const { onWithdraw } = useWithdraw({
    tradePool: poolPubkey,
    amountToUnstake: withdrawValue,
    onCancel,
    onClearDepositValue,
  });

  const notEnoughDepositError = depositAmount < Number(withdrawValue);

  const isDisabledWithdrawBtn =
    Number(withdrawValue) === 0 || notEnoughDepositError;

  const withdrawBtnHandler = () => {
    if (tradePool) {
      onWithdraw();
    } else {
      unstakeLiquidity();
    }
  };

  return (
    <>
      <TokenFieldWithBalance
        value={withdrawValue}
        onValueChange={onWithdrawValueChange}
        currentToken={SOL_TOKEN}
        label={tradePool ? `available:` : `Your deposit:`}
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
      <Button
        onClick={withdrawBtnHandler}
        className={styles.btn}
        type="secondary"
        disabled={isDisabledWithdrawBtn}
      >
        Withdraw
      </Button>
    </>
  );
};

export default WithdrawTab;
