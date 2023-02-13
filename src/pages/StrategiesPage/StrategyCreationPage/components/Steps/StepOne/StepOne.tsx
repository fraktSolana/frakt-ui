import { FC } from 'react';
import { TextInput } from '@frakt/components/TextInput';
import InputUpload from '../../InputUpload/InputUpload';

import styles from './StepOne.module.scss';

interface StepOneProps {
  className: string;
  imageUrl: string;
  setImageUrl: (val: string) => void;
  setStrategyName: (val: string) => void;
}

const StepOne: FC<StepOneProps> = ({
  className,
  imageUrl,
  setImageUrl,
  setStrategyName,
}) => {
  const handleStrategyName = (val: string) => setStrategyName(val);

  return (
    <div className={className}>
      <InputUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />

      <TextInput
        wrapperClassName={styles.inputWrapper}
        className={styles.input}
        label="strategy name"
        onChange={handleStrategyName}
        placeholder="My awesome strategy"
      />
    </div>
  );
};

export default StepOne;
