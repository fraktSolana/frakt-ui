import { FC } from 'react';

import { TokenFieldWithBalance } from '../../TokenField';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { Slider } from '../../Slider';
import Button from '../../Button';
import { marks, usePoolModal } from '../hooks';
import { useWithdraw } from '@frakt/utils/strategies';
import { SOL_TOKEN } from '../../../utils';
import styles from './WithdrawTab.module.scss';

interface WithdrawTabProps {
  depositAmount: number;
  tradePool: string;
  onCancel: () => void;
}

const WithdrawTab: FC<WithdrawTabProps> = ({
  depositAmount,
  tradePool,
  onCancel,
}) => {
  const {
    withdrawValue,
    percentValue,
    onWithdrawValueChange,
    onWithdrawPercentChange,
    onClearDepositValue,
  } = usePoolModal({ depositAmount });

  const { onWithdraw, loadingModalVisible, closeLoadingModal } = useWithdraw({
    tradePool,
    amountToUnstake: withdrawValue,
    onCancel,
    onClearDepositValue,
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
        onClick={onWithdraw}
        className={styles.btn}
        type="secondary"
        disabled={isDisabledWithdrawBtn}
      >
        Withdraw
      </Button>
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </div>
  );
};

export default WithdrawTab;
