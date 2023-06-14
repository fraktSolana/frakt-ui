import { useState } from 'react';

export const useNumericInput = (
  label: string,
  initialValue: string,
): {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
} => {
  const [value, setValue] = useState<string>(initialValue);

  const handleChange = (nextValue: string): void => {
    setValue(nextValue);
  };

  return {
    label,
    value,
    onChange: handleChange,
  };
};
