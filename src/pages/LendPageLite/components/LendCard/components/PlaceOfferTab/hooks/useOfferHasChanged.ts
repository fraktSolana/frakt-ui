import { useEffect, useState } from 'react';
import { isEmpty, isEqual, pick } from 'lodash';

import { InitialEditValues } from './../types';

export const useOfferHasChanged = (
  initialEditValues: InitialEditValues,
  isEdit: boolean,
  loanValue: string,
  loanAmount: string,
) => {
  const [isOfferHasChanged, setIsOfferHasChanged] = useState(false);

  useEffect(() => {
    if (!isEmpty(initialEditValues) && isEdit) {
      const currentValues = { loanAmount, loanValue };

      const hasChanged = !isEqual(
        pick(currentValues, Object.keys(initialEditValues)),
        initialEditValues,
      );

      setIsOfferHasChanged(hasChanged);
    }
  }, [initialEditValues, isEdit, loanValue, loanAmount]);

  return isOfferHasChanged;
};
