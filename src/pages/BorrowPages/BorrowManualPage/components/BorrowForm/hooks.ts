import { useCallback, useEffect, useMemo, useState } from 'react';

import { LoanType } from '@frakt/api/loans';
import {
  BondOrderParams,
  convertTakenOrderToOrderParams,
  useBorrow,
} from '@frakt/pages/BorrowPages/cartState';

import {
  generateSelectOptions,
  getBorrowValueRange,
  SelectValue,
} from './helpers';
import { getBestOrdersByBorrowValue } from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2';
import { pairLoanDurationFilter } from '@frakt/utils/bonds';
import { calcDurationByMultiOrdersBond } from '@frakt/pages/BorrowPages/helpers';

export const useBorrowForm = () => {
  const {
    currentNft,
    currentLoanValue,
    setCurrentLoanValue,
    market,
    pairs,
    isBulk,
    totalBorrowValue,
    setCurrentLoanType,
    currentLoanType,
    currentBondOrderParams,
    setCurrentBondOrderParams,
  } = useBorrow();

  const [selectedOption, setSelectedOption] = useState<SelectValue | null>(
    null,
  );

  const onSelectOption = useCallback(
    (value: SelectValue) => {
      setSelectedOption(value);
      setCurrentLoanType(value.value.type);
    },
    [setCurrentLoanType],
  );

  //? Genereate select options
  const selectOptions = useMemo(() => {
    if (!currentNft) return [];
    return generateSelectOptions({
      nft: currentNft,
      bondsParams: {
        pairs,
      },
    });
  }, [currentNft, pairs]);

  //? Select default select option (when user selects nft)
  useEffect(() => {
    if (selectOptions.length) {
      const defaultOption = selectOptions.find((option) => !option.disabled);

      if (currentNft && currentLoanType) {
        const selectOption = selectOptions.find(({ value }) => {
          const sameLoanType = value?.type === currentLoanType;
          const isBond = currentLoanType === LoanType.BOND;

          if (!isBond) {
            return sameLoanType;
          }
          const sameBondDuration =
            value?.type === LoanType.BOND &&
            calcDurationByMultiOrdersBond(currentBondOrderParams) / 86400 ===
              value?.duration;

          return sameLoanType && sameBondDuration;
        });

        return onSelectOption(selectOption || defaultOption);
      }

      onSelectOption(defaultOption); //TODO: change to available. F.e. If classic loans not available
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectOptions, onSelectOption]);

  //? Recalc cheapest pair on currentLoanValue change
  useEffect(() => {
    if (selectedOption?.value?.type === LoanType.BOND && market) {
      const { takenOrders } = getBestOrdersByBorrowValue({
        borrowValue: currentLoanValue,
        collectionFloor: market?.oracleFloor?.floor,
        bondOffers: pairs.filter((p) =>
          pairLoanDurationFilter({
            pair: p,
            duration: selectedOption.value.duration,
          }),
        ),
      });

      const bondOrderParams: BondOrderParams = {
        market,
        orderParams: takenOrders.map((order) => {
          const affectedPair = pairs.find(
            (pair) => pair.publicKey === order.pairPubkey,
          );

          return convertTakenOrderToOrderParams({
            pair: affectedPair,
            takenOrder: order,
          });
        }),
      };

      setCurrentBondOrderParams(bondOrderParams);
    } else {
      setCurrentBondOrderParams(null);
    }
  }, [
    market,
    currentLoanValue,
    pairs,
    selectedOption,
    setCurrentBondOrderParams,
  ]);

  //? Calc loanValue range
  const [minBorrowValue, maxBorrowValue] = useMemo(() => {
    if (!currentNft || !selectedOption) return [0, 0];
    return getBorrowValueRange({
      nft: currentNft,
      loanType: selectedOption?.value?.type,
      bondsParams: {
        pairs,
        duration: selectedOption?.value?.duration,
        market,
      },
    });
  }, [currentNft, selectedOption, market, pairs]);

  //? Set loanValue to max available when prev selected value vas higher
  //? F.e. Was selected loanValue: 10 SOL for bonds, but then you change option to perp,
  //? and maxLoanValue there is 8 SOL -- you need to change currentLoanValue to 8 insted of 10
  useEffect(() => {
    if (selectedOption && maxBorrowValue && currentLoanType) {
      if (maxBorrowValue < currentLoanValue || currentLoanValue === 0) {
        setCurrentLoanValue(maxBorrowValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, maxBorrowValue]);

  return {
    currentLoanValue,
    minBorrowValue,
    maxBorrowValue,
    setCurrentLoanValue,
    selectOptions,
    selectedOption,
    onSelectOption,
    isBulk,
    totalBorrowValue,
  };
};
