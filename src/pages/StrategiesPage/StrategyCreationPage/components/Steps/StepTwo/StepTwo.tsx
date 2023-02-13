import { ChangeEvent, FC } from 'react';

import RadioButton from '@frakt/components/RadioButton';
import SliderGradient from '@frakt/components/SliderGradient';
import SearchCollection from '../../SearchCollection';

interface StepTwoProps {
  className: string;
  duration: string;
  setDuration: (val: string) => void;
  maxLTV: number;
  setMaxLTV: (val: number) => void;
}

const StepTwo: FC<StepTwoProps> = ({
  className,
  duration,
  setDuration,
  maxLTV,
  setMaxLTV,
}) => {
  const handleDuration = (e: ChangeEvent<HTMLInputElement>) => {
    setDuration(e.target.value);
  };

  const handleMaxLTV = (value: number) => setMaxLTV(value);

  return (
    <div className={className}>
      <SearchCollection />
      <SliderGradient value={maxLTV} onChange={handleMaxLTV} />
      <RadioButton
        labelName="duration"
        tooltipText="duration duration duration"
        current={duration}
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
