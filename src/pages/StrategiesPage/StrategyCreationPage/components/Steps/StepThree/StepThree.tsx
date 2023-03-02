import { ChangeEvent, FC } from 'react';
import RadioButton from '@frakt/components/RadioButton';
import TokenField from '@frakt/components/TokenField';
import InputField from '@frakt/components/InputField';

import { SOL_TOKEN } from '@frakt/utils';
import Chart from '@frakt/components/Chart';
import usePriceGraph from '@frakt/components/Chart/hooks/usePriceGraph';
import { BondingCurveType } from 'fbonds-core/lib/fbond-protocol/types';
import { FormValues } from '../../../types';
import { BOND_DECIMAL_DELTA } from '@frakt/utils/bonds';

interface StepThreeProps {
  className: string;
  formValues: FormValues;
  setFormValues: (prev) => void;
  unit: '%' | 'sec' | 'SOL';
}

export interface Point {
  price: number;
  order: number;
}

const StepThree: FC<StepThreeProps> = ({
  className,
  formValues,
  setFormValues,
  unit,
}) => {
  const handleInterest = (value: string) =>
    setFormValues((prev: FormValues) => ({ ...prev, interest: value }));

  const handleBidCap = (value: string) => {
    setFormValues((prev: FormValues) => ({ ...prev, bidCap: value }));
  };

  const handleDuration = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev: FormValues) => ({
      ...prev,
      bondingType: e.target.value,
    }));
  };

  const handleDelta = (value: string) => {
    setFormValues((prev: FormValues) => ({
      ...prev,
      delta: value,
    }));
  };

  const spotPrice = BOND_DECIMAL_DELTA - Number(formValues.interest) * 100;

  const points = usePriceGraph({
    spotPrice: Number(spotPrice),
    delta: Number(formValues.delta),
    bondingCurve: formValues.bondingType,
  });

  return (
    <div className={className}>
      <TokenField
        value={formValues.interest}
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
      {/* <TokenField
        value={formValues.spotPrice}
        onValueChange={handleSpotPice}
        label="starting spot price"
        currentToken={SOL_TOKEN}
        toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
      /> */}
      <RadioButton
        labelName="bonding curve"
        tooltipText="bonding curve"
        current={formValues.bondingType}
        onChange={handleDuration}
        buttons={[
          { value: BondingCurveType.Linear, name: 'Linear' },
          { value: BondingCurveType.Exponential, name: 'Exponential' },
          { value: 'xyk', name: 'XYK' },
        ]}
      />
      <InputField
        unit={unit}
        label="delta"
        toolTipText="delta"
        value={formValues.delta}
        onValueChange={handleDelta}
      />

      <InputField
        unit="fSOL"
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
