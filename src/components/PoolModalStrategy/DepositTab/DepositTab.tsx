import { FC } from 'react';

import { marks, usePoolModal } from '../hooks';
import { TokenFieldWithBalance } from '../../TokenField';
import styles from './DepositTab.module.scss';
import { SOL_TOKEN } from '../../../utils';
import { Slider } from '../../Slider';
import Button from '../../Button';
import classNames from 'classnames/bind';
import { useDeposit } from '@frakt/pages/StrategiesPage/StrategyCreationPage/hooks/useDeposit';

interface DepositTabProps {
  utilizationRate: number;
  onCancel: () => void;
  depositYield: number;
  depositAmount: number;
  tradePool: any;
}

const DepositTab: FC<DepositTabProps> = ({
  utilizationRate,
  depositYield,
  depositAmount,
  onCancel,
  tradePool,
}) => {
  const {
    depositValue,
    percentValue,
    onDepositValueChange,
    onDepositPercentChange,
    solWalletBalance,
    onClearDepositValue,
  } = usePoolModal({ depositAmount });

  const { onCreateInvestment } = useDeposit({
    tradePool,
    amountToDeposit: depositValue,
    onCancel,
  });

  const setDeposit = () => {
    onCreateInvestment();
    onClearDepositValue();
  };

  const solWalletBalanceNumber = parseFloat(solWalletBalance.toFixed(2));
  const depositValueNumber = parseFloat(depositValue) || 0;

  const notEnoughBalanceError = solWalletBalanceNumber < depositValueNumber;

  const isDisabledDepositBtn =
    depositValueNumber === 0 || notEnoughBalanceError;

  return (
    <div className={styles.wrapper}>
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

      <div className={styles.infoWrapper}>
        <div className={styles.info}>
          <span className={styles.infoTitle}>Deposit yield</span>
          <span
            className={classNames(styles.infoValue, {
              [styles.negative]: Math.sign(depositYield) === -1,
              [styles.positive]: Math.sign(depositYield) === 1,
            })}
          >
            {depositYield?.toFixed(2)} %
          </span>
        </div>
        <div className={styles.info}>
          <span className={styles.infoTitle}>Utilization rate</span>
          <span className={styles.infoValue}>
            {(utilizationRate * 100).toFixed(2)} %
          </span>
        </div>
      </div>

      <div className={styles.estimated}>
        <div className={styles.earnings}>
          {((depositYield / 12) * +depositValue).toFixed(2)} SOL/month
        </div>
        <div className={styles.estimatedTitle}>estimated earnings</div>
      </div>

      <Button
        onClick={setDeposit}
        className={styles.btn}
        type="secondary"
        disabled={isDisabledDepositBtn}
      >
        Deposit
      </Button>
    </div>
  );
};

export default DepositTab;
