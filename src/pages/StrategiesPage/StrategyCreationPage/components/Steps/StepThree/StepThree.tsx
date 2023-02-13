import { ChangeEvent, FC } from 'react';
import RadioButton from '@frakt/components/RadioButton';
import TokenField from '@frakt/components/TokenField';
import InputField from '@frakt/components/InputField';

import { SOL_TOKEN } from '@frakt/utils';
import Chart from '@frakt/components/Chart';
import usePriceGraph from '@frakt/components/Chart/hooks/usePriceGraph';
import { BondingCurveType } from 'fbonds-core/lib/fbond-protocol/types';

interface StepThreeProps {
  className: string;
  bondingCurve: BondingCurveType;
  setBondingCurve: (val: BondingCurveType) => void;
  spotPrice: string;
  setSpotPrice: (val: string) => void;
  bidCap: string;
  setBidCap: (val: string) => void;
  delta: string;
  setDelta: (val: string) => void;
  deltaType: '%' | 'sec' | 'SOL';
}

export interface Point {
  price: number;
  order: number;
}

const StepThree: FC<StepThreeProps> = ({
  className,
  bondingCurve,
  setBondingCurve,
  spotPrice,
  setSpotPrice,
  bidCap,
  setBidCap,
  delta,
  setDelta,
  deltaType,
}) => {
  const handleSolFee = (value: string) => setSpotPrice(value);
  const handleBidCap = (value: string) => setBidCap(value);
  const handleDuration = (e: ChangeEvent<HTMLInputElement>) => {
    setBondingCurve(e.target.value as BondingCurveType);
  };
  const handleDelta = (value: string) => {
    setDelta(value);
  };

  const data = [
    { price: 20, order: 1 },
    { price: 27, order: 2 },
    { price: 34, order: 3 },
  ] as Point[];

  const points = usePriceGraph({
    spotPrice: Number(spotPrice),
    delta: Number(delta),
    bondingCurve,
  });

  console.log('points steps', points);
  return (
    <div className={className}>
      <TokenField
        value={spotPrice}
        onValueChange={handleSolFee}
        label="starting spot price"
        currentToken={SOL_TOKEN}
        toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
      />
      <RadioButton
        labelName="bonding curve"
        tooltipText="bonding curve"
        current={bondingCurve}
        onChange={handleDuration}
        buttons={[
          { value: BondingCurveType.Linear, name: 'Linear' },
          { value: BondingCurveType.Exponential, name: 'Exponential' },
          { value: 'xyk', name: 'XYK' },
        ]}
      />
      <InputField
        unit={deltaType}
        label="delta"
        toolTipText="delta"
        value={delta}
        onValueChange={handleDelta}
      />

      <InputField
        unit="fSOL"
        label="bid capacity"
        toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
        value={bidCap}
        onValueChange={handleBidCap}
      />

      {!!points?.length && <Chart data={points} />}
    </div>
  );
};

export default StepThree;
