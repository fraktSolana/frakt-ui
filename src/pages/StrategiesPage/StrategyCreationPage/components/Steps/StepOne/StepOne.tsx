import { FC } from 'react';
import { TextInput } from '@frakt/components/TextInput';
import InputUpload from '../../InputUpload/InputUpload';

import styles from './StepOne.module.scss';
import { FormValues } from '@frakt/utils/strategies/types';

interface StepOneProps {
  className: string;
  formValues: FormValues;
  setFormValues: (
    value: FormValues | ((prevVar: FormValues) => FormValues),
  ) => void;
}

const StepOne: FC<StepOneProps> = ({
  className,
  formValues,
  setFormValues,
}) => {
  const handleStrategyName = (val: string) =>
    setFormValues((prev) => ({ ...prev, strategyName: val }));

  return (
    <div className={className}>
      <InputUpload
        imageUrl={formValues.image.imageUrl}
        setFormValues={setFormValues}
      />

      <TextInput
        wrapperClassName={styles.inputWrapper}
        className={styles.input}
        label="strategy name"
        defaultValue={formValues.strategyName}
        onChange={handleStrategyName}
        placeholder="My awesome strategy"
      />
    </div>
  );
};

export default StepOne;
