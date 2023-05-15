import { FC } from 'react';
import classNames from 'classnames';
import { Slider as SliderAntd } from 'antd';

import styles from './Slider.module.scss';

interface SliderProps {
  value?: number;
  defaultValue?: number;
  setValue?: (nextValue: number) => void;
  className?: string;
  marks?: { [key: number]: string | JSX.Element };
  step?: number;
  withTooltip?: boolean;
  max?: number;
  min?: number;
  disabled?: boolean;
  onAfterChange?: (nextValue: number) => void;
}

export const Slider: FC<SliderProps> = ({
  className,
  marks,
  defaultValue,
  value,
  setValue,
  step,
  withTooltip,
  max,
  min,
  disabled,
  onAfterChange,
}) => {
  return (
    <div
      className={classNames(
        withTooltip && styles.withTooltip,
        styles.slider,
        className,
      )}
    >
      <SliderAntd
        marks={marks}
        defaultValue={defaultValue}
        value={value}
        onChange={setValue}
        onAfterChange={onAfterChange}
        tooltip={{ open: false }}
        step={step}
        max={max}
        min={min}
        disabled={disabled}
      />
    </div>
  );
};
