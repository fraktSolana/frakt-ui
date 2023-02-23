import { FC } from 'react';
import { TextInput } from '@frakt/components/TextInput';
import InputUpload from '../../InputUpload/InputUpload';

import styles from './StepOne.module.scss';
import { FormValues } from '../../../types';

interface StepOneProps {
  className: string;
  formValues: FormValues;
  setFormValues: (prev) => void;
}

const StepOne: FC<StepOneProps> = ({
  className,
  formValues,
  setFormValues,
}) => {
  const handleStrategyName = (val: string) =>
    setFormValues((prev: FormValues) => ({ ...prev, strategyName: val }));

  return (
    <div className={className}>
      <InputUpload
        imageUrl={formValues.image.imageUrl}
        setImageUrl={setFormValues}
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
