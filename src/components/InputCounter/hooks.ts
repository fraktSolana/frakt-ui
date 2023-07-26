export const useInputCounter = (
  initialValue: string,
  onChange: (nextValue: string) => void,
) => {
  const parseValueToFloat = (value: string): number => {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
  };

  const updateValue = (nextValue: number) => {
    const parsedValue = parseValueToFloat(initialValue);
    const updatedValue = (parsedValue + nextValue).toString();
    onChange(updatedValue);
  };

  const increaseValue = () => {
    updateValue(1);
  };

  const decreaseValue = () => {
    updateValue(-1);
  };

  const isValueGreaterThanOne = parseValueToFloat(initialValue) > 1;

  return {
    value: initialValue,
    onChange,
    increaseValue,
    decreaseValue,
    isValueGreaterThanOne,
    parseValueToFloat,
  };
};
