import { ChangeEvent, FC } from 'react';

import RadioButton from '@frakt/components/RadioButton';
import SliderGradient from '@frakt/components/SliderGradient';
import SearchCollection from '../../SearchCollection';
import { useMarkets } from '@frakt/utils/bonds';
import { FormValues } from '../../../types';

interface StepTwoProps {
  className: string;
  formValues: FormValues;
  setFormValues: (prev) => void;
}

const StepTwo: FC<StepTwoProps> = ({
  className,
  formValues,
  setFormValues,
}) => {
  const { markets, isLoading } = useMarkets();

  const handleDuration = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev: FormValues) => ({
      ...prev,
      duration: e.target.value,
    }));
  };

  const handleMaxLTV = (value: number) => {
    setFormValues((prev: FormValues) => ({
      ...prev,
      maxLTV: value,
    }));
  };

  return (
    <div className={className}>
      <SearchCollection
        markets={markets}
        isLoading={isLoading}
        formValues={formValues}
        setFormValues={setFormValues}
      />
      <SliderGradient value={formValues.maxLTV} onChange={handleMaxLTV} />
      <RadioButton
        labelName="duration"
        tooltipText="duration duration duration"
        current={formValues.duration}
        onChange={handleDuration}
        buttons={[
          { value: '7', name: '7 days' },
          { value: '14', name: '14 days' },
        ]}
      />
    </div>
  );
};

export default StepTwo;
