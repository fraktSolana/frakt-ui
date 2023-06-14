import { useState } from 'react';

type RBOption<T> = {
  value: T;
};

export const useRBOptionState = <T>(initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);

  const handleChange = (nextOption: RBOption<T>) => {
    setValue(nextOption.value);
  };

  return [value, handleChange] as const;
};
