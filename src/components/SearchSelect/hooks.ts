import { useEffect, useState } from 'react';

export const useSelectedOptions = ({
  onFilterChange,
}: {
  onFilterChange?: (filteredOptions: string[]) => void;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSelectChange = (value: string[]): void => {
    setSelectedOptions(value);
  };

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(selectedOptions);
    }
  }, [selectedOptions]);

  return {
    selectedOptions,
    handleSelectChange,
  };
};
