import { FC } from 'react';
import TokenField from '@frakt/components/TokenField';
import InputField from '@frakt/components/InputField';
import { SOL_TOKEN } from '@frakt/utils';

import { FormValues } from '../../../types';
import styles from './StepFour.module.scss';

interface StepFourProps {
  className: string;
  formValues: FormValues;
  setFormValues: (prev) => void;
  deltaType: string;
}

const StepFour: FC<StepFourProps> = ({
  className,
  formValues,
  setFormValues,
  deltaType,
}) => {
  const handleMaxTradeAmount = (value: string) => {
    setFormValues((prev: FormValues) => ({
      ...prev,
      maxTradeAmount: value,
    }));
  };

  const handleUtilizationRate = (value: string) => {
    setFormValues((prev: FormValues) => ({
      ...prev,
      utilizationRate: value,
    }));
  };

  const handleTradeDuration = (value: string) => {
    setFormValues((prev: FormValues) => ({
      ...prev,
      tradeDuration: value,
    }));
  };

  const handleTradeAmountRatio = (value: string) => {
    setFormValues((prev: FormValues) => ({
      ...prev,
      remainingSolRatioToFinishTrade: value,
    }));
  };

  const handleMinTime = (value: string) => {
    setFormValues((prev: FormValues) => ({
      ...prev,
      minTimeBetweenTrades: value,
    }));
  };

  return (
    <div className={className}>
      <InputField
        unit="%"
        label="utilization rate"
        toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
        value={formValues.utilizationRate}
        onValueChange={handleUtilizationRate}
      />
      <TokenField
        label="max trade amount"
        toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
        currentToken={SOL_TOKEN}
        value={formValues.maxTradeAmount}
        onValueChange={handleMaxTradeAmount}
      />
      <InputField
        unit="sec"
        label="trade duration"
        toolTipText="max: 86400"
        value={formValues.tradeDuration}
        onValueChange={handleTradeDuration}
      />
      <InputField
        unit="%"
        label="remaining sol ratio to finish trade"
        toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
        value={formValues.remainingSolRatioToFinishTrade}
        onValueChange={handleTradeAmountRatio}
      />
      <InputField
        unit="sec"
        label="min time between trades"
        toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
        value={formValues.minTimeBetweenTrades}
        onValueChange={handleMinTime}
      />

      <div className={styles.info}>
        <p className={styles.infoItem}>
          Your strategy lend money to {formValues.hadoMarkets.marketName}{' '}
          collections, for up to
          {' ' + formValues.loanToValueFilter}% LTV and{' '}
          {formValues.durationFilter} days
        </p>
        <p className={styles.infoItem}>
          Your strategy will place orders starting with {formValues.spotPrice}{' '}
          SOL interest getting {formValues.delta}
          {' ' + deltaType} high every time order is filled up to
          {' ' + formValues.bidCap}
        </p>
        <p className={styles.infoItem}>
          It will use {formValues.remainingSolRatioToFinishTrade || '0'}% of
          deposited funds and every trade considered staled and removed after{' '}
          {formValues.tradeDuration}
        </p>
      </div>
    </div>
  );
};

export default StepFour;
