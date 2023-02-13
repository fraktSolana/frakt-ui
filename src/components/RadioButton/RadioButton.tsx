import { ChangeEvent, FC } from 'react';
import Tooltip from '../Tooltip';

import styles from './RadioButton.module.scss';

interface RadioButtonProps {
  labelName?: string;
  tooltipText?: string;
  current: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  buttons: { value: string; name: string }[];
}

const RadioButton: FC<RadioButtonProps> = ({
  labelName,
  tooltipText,
  current,
  onChange,
  buttons,
}) => {
  return (
    <div className={styles.radioButton}>
      {labelName && (
        <div className={styles.label}>
          {labelName}
          <Tooltip placement="bottom" overlay={tooltipText} />
        </div>
      )}

      <div className={styles.wrapper}>
        {buttons.map(({ value, name }) => (
          <div className={styles.btn} key={value}>
            <input
              type="radio"
              id={value}
              name="maxDuration"
              value={value}
              checked={current === value}
              onChange={onChange}
            />
            <label htmlFor={value}>{name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioButton;
