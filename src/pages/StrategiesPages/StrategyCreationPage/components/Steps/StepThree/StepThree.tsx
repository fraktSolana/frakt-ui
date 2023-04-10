import { ChangeEvent, FC } from 'react';
import TokenField from '@frakt/components/TokenField';
import InputField from '@frakt/components/InputField';
import Chart from '@frakt/components/Chart';

import { SOL_TOKEN } from '@frakt/utils';
import { BondingCurveType } from 'fbonds-core/lib/fbond-protocol/types';
import usePriceGraph from '@frakt/components/Chart/hooks/usePriceGraph';
import { FormValues } from '@frakt/utils/strategies/types';
import { RadioButton } from '@frakt/components/RadioButton';

interface StepThreeProps {
  className: string;
  formValues: FormValues;
  setFormValues: (
    value: FormValues | ((prevVar: FormValues) => FormValues),
  ) => void;
}

export interface Point {
  price: number;
  order: number;
}

const StepThree: FC<StepThreeProps> = ({
  className,
  formValues,
  setFormValues,
}) => {
  const handleInterest = (value: string) =>
    setFormValues((prev) => ({
      ...prev,
      spotPrice: +value >= 100 ? String(100) : value,
    }));

  const handleBidCap = (value: string) => {
    setFormValues((prev) => ({ ...prev, bidCap: value }));
  };

  const handleDuration = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      bondingType: e.target.value as BondingCurveType,
    }));
  };

  const handleDelta = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      delta: +value >= 100 ? String(100) : value,
    }));
  };

  const points = usePriceGraph({
    spotPrice: Number(formValues.spotPrice),
    delta: Number(formValues.delta),
    bondingCurve: formValues.bondingType,
  });

  return (
    <div className={className}>
      <TokenField
        value={formValues.spotPrice}
        onValueChange={handleInterest}
        label="starting interest"
        currentToken={{
          ...SOL_TOKEN,
          symbol: '%',
          logoURI: null,
          name: null,
        }}
        tokensList={[{ ...SOL_TOKEN, symbol: '%', logoURI: null, name: null }]}
        toolTipText="Interest (in %) for the duration of this loan"
      />

      {/* <RadioButton
        labelName="bonding curve"
        tooltipText="bonding curve"
        current={formValues.bondingType}
        onChange={handleDuration}
        buttons={[
          { value: BondingCurveType.Linear, name: 'Linear' },
          { value: BondingCurveType.Exponential, name: 'Exponential' },
        ]}
      /> */}

      <TokenField
        value={formValues.delta}
        onValueChange={handleDelta}
        label="delta"
        currentToken={{
          ...SOL_TOKEN,
          symbol: '%',
          logoURI: null,
          name: null,
        }}
        tokensList={[{ ...SOL_TOKEN, symbol: '%', logoURI: null, name: null }]}
        toolTipText="delta"
      />

      <InputField
        unit="bSOL"
        label="bid capacity"
        toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
        value={formValues.bidCap}
        onValueChange={handleBidCap}
      />

      {!!points?.length && <Chart data={points} />}
    </div>
  );
};

export default StepThree;
