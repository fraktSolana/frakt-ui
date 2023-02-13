import { FC } from 'react';
import TokenField from '@frakt/components/TokenField';
import InputField from '@frakt/components/InputField';
import { SOL_TOKEN } from '@frakt/utils';

import styles from './StepFour.module.scss';

interface StepFourProps {
  className: string;
  spotPrice: string;
  maxLTV: number;
  duration: string;
  delta: string;
  bidCap: string;
  maxTradeAmount: string;
  setMaxTradeAmount: (val: string) => void;
  utilizationRate: string;
  setUtilizationRate: (val: string) => void;
  tradeDuration: string;
  setTradeDuration: (val: string) => void;
  tradeAmountRatio: string;
  setTradeAmountRatio: (val: string) => void;
  minTimeBetweenTrades: string;
  setMinTimeBetweenTrades: (val: string) => void;
  deltaType: string;
}

const StepFour: FC<StepFourProps> = ({
  className,
  spotPrice,
  maxLTV,
  duration,
  delta,
  deltaType,
  bidCap,
  maxTradeAmount,
  setMaxTradeAmount,
  utilizationRate,
  setUtilizationRate,
  tradeDuration,
  setTradeDuration,
  tradeAmountRatio,
  setTradeAmountRatio,
  minTimeBetweenTrades,
  setMinTimeBetweenTrades,
}) => {
  const handleMaxTradeAmount = (value: string) => setMaxTradeAmount(value);
  const handleUtilizationRate = (value: string) => setUtilizationRate(value);
  const handleTradeDuration = (value: string) => setTradeDuration(value);
  const handleRatioSol = (value: string) => setTradeAmountRatio(value);
  const handleMinTime = (value: string) => setMinTimeBetweenTrades(value);

  return (
    <div className={className}>
      <InputField
        unit="%"
        label="utilization rate"
        toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
        value={utilizationRate}
        onValueChange={handleUtilizationRate}
      />
      <TokenField
        label="max trade amount"
        toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
        currentToken={SOL_TOKEN}
        value={maxTradeAmount}
        onValueChange={handleMaxTradeAmount}
      />
      <InputField
        unit="sec"
        label="trade duration"
        toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
        value={tradeDuration}
        onValueChange={handleTradeDuration}
      />
      <InputField
        unit="%"
        label="remaining sol ratio to finish trade"
        toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
        value={tradeAmountRatio}
        onValueChange={handleRatioSol}
      />
      <InputField
        unit="sec"
        label="min time between trades"
        toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
        value={minTimeBetweenTrades}
        onValueChange={handleMinTime}
      />

      <div className={styles.info}>
        <p className={styles.infoItem}>
          Your strategy lend money to _hadoMarket_ collections, for up to
          {' ' + maxLTV}% LTV and {duration} days
        </p>
        <p className={styles.infoItem}>
          Your strategy will place orders starting with {spotPrice} SOL interest
          getting {delta}
          {deltaType} high every time order is filled up to
          {bidCap}
        </p>
        <p className={styles.infoItem}>
          It will use {tradeAmountRatio || '0'}% of deposited funds and every
          trade considered staled and removed after {tradeDuration}
        </p>
      </div>
    </div>
  );
};

export default StepFour;
