import { FC } from 'react';
import {
  colorByPercentSlider,
  getColorByPercent,
  calcRisk,
} from '@frakt/utils/bonds';

import { Slider } from '@frakt/components/Slider';
import Tooltip from '@frakt/components/Tooltip';
import styles from './SliderGradient.module.scss';

interface SliderGradientProps {
  value: number;
  onChange: (nextValue: number) => void;
  disabled?: boolean;
}

const riskMarks: { [key: string]: string | JSX.Element } = {
  10: '10%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
};

const SliderGradient: FC<SliderGradientProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const colorLTV = getColorByPercent(value, colorByPercentSlider);
  return (
    <div className={styles.sliderGradient}>
      <div className={styles.labelWrapper}>
        <div className={styles.label}>
          ltv{' '}
          <Tooltip
            placement="bottom"
            overlay="Analyzed profit from repaying the loan"
          />
        </div>
        <div className={styles.label}>
          risk level
          <span style={{ color: `${colorLTV}` }}>{calcRisk(value)}</span>
        </div>
      </div>
      <div>
        <div className={styles.gradient}></div>
        <Slider
          className={styles.slider}
          marks={riskMarks}
          value={value}
          setValue={onChange}
          withTooltip
          step={1}
          min={10}
          max={100}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default SliderGradient;
