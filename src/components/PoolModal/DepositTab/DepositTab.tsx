import { FC } from 'react';
import classNames from 'classnames';

import { TokenFieldWithBalance } from '../../TokenField';
import { Slider } from '../../Slider';
import Button from '../../Button';
import { SOL_TOKEN } from '../../../utils';
import { marks, usePoolModal, useDepositTxn } from '../hooks';
import { sendAmplitudeData } from '../../../utils/amplitude';
import { useDeposit } from '@frakt/utils/strategies';
import styles from './DepositTab.module.scss';

interface DepositTabProps {
  isTradePool?: boolean;
  utilizationRate: number;
  onCancel: () => void;
  depositAmount: number;
  poolPubkey: string;
  depositYield: number;
}

const MOUTH_IN_YEAR = 12;

const DepositTab: FC<DepositTabProps> = ({
  isTradePool,
  utilizationRate,
  depositAmount,
  poolPubkey,
  onCancel,
  depositYield,
}) => {
  const {
    depositValue,
    percentValue,
    onDepositValueChange,
    onDepositPercentChange,
    solWalletBalance,
    onClearDepositValue,
  } = usePoolModal({ depositAmount });

  const { depositLiquidity } = useDepositTxn({
    poolPubkey,
    depositValue,
    onCancel,
    onClearDepositValue,
  });

  const { onCreateInvestment } = useDeposit({
    tradePool: poolPubkey,
    amountToDeposit: depositValue,
    onCancel,
    onClearDepositValue,
  });

  const solWalletBalanceNumber = parseFloat(solWalletBalance.toFixed(2));
  const depositValueNumber = parseFloat(depositValue) || 0;

  const notEnoughBalanceError = solWalletBalanceNumber < depositValueNumber;

  const isDisabledDepositBtn =
    depositValueNumber === 0 || notEnoughBalanceError;

  const depositBtnHandler = () => {
    if (isTradePool) {
      onCreateInvestment();
    } else {
      depositLiquidity();
      sendAmplitudeData('loans-confirm-deposit');
    }
  };

  const estimatedEarings =
    ((depositYield / MOUTH_IN_YEAR) * parseFloat(depositValue || '0')) / 100;

  return (
    <div className={styles.wrapper}>
      <div>
        <TokenFieldWithBalance
          className={styles.input}
          value={depositValue}
          onValueChange={onDepositValueChange}
          currentToken={SOL_TOKEN}
          label={`BALANCE:`}
          lpBalance={solWalletBalanceNumber}
          error={notEnoughBalanceError}
          showMaxButton
          labelRight
        />
        <div className={styles.errors}>
          {notEnoughBalanceError && <p>Not enough SOL</p>}
        </div>
        <Slider
          value={percentValue}
          setValue={solWalletBalance && onDepositPercentChange}
          className={styles.slider}
          marks={marks}
          withTooltip
          step={1}
        />
      </div>
      <div>
        <div className={styles.info}>
          <span className={styles.infoTitle}>Deposit yield</span>
          <span
            className={classNames(styles.infoValue, {
              [styles.negative]: Math.sign(depositYield) === -1,
              [styles.positive]: Math.sign(depositYield) === 1,
            })}
          >
            {(depositYield || 0).toFixed(2)} %
          </span>
        </div>
        <div className={styles.info}>
          <span className={styles.infoTitle}>Utilization rate</span>
          <span className={styles.infoValue}>
            {(utilizationRate || 0).toFixed(2)} %
          </span>
        </div>

        {isTradePool && (
          <div className={styles.estimated}>
            <div className={styles.earnings}>
              {estimatedEarings.toFixed(2)} SOL/month
            </div>
            <div className={styles.estimatedTitle}>estimated earnings</div>
          </div>
        )}

        <Button
          onClick={depositBtnHandler}
          className={styles.btn}
          type="secondary"
          disabled={isDisabledDepositBtn}
        >
          Deposit
        </Button>
      </div>
    </div>
  );
};

export default DepositTab;
