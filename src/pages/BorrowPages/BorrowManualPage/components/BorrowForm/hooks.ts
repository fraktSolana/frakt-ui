import { useCallback, useEffect, useMemo, useState } from 'react';

import { LoanType } from '@frakt/api/loans';
import {
  BondOrder,
  convertTakenOrdersToOrderParams,
  useBorrow,
} from '@frakt/pages/BorrowPages/cartState';

import {
  generateSelectOptions,
  getBorrowValueRange,
  getCheapestPairForBorrowValue,
  SelectValue,
} from './helpers';
import { getBestOrdersByBorrowValue } from 'fbonds-core/lib/fbond-protocol/utils/cartManager';
import { pairLoanDurationFilter } from '@frakt/utils/bonds';

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
    setCurrentPair,
    setCurrentBondOrder,
    currentLoanType,
    currentPair,
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
      if (currentNft && currentLoanType) {
        const selectOption = selectOptions.find(({ value }) => {
          const sameLoanType = value?.type === currentLoanType;
          const isBond = currentLoanType === LoanType.BOND;

          if (!isBond) {
            return sameLoanType;
          }
          const sameBondDuration =
            value?.type === LoanType.BOND &&
            currentPair?.validation?.durationFilter / 86400 === value?.duration;

          return sameLoanType && sameBondDuration;
        });

        return onSelectOption(selectOption || selectOptions[0]);
      }

      onSelectOption(selectOptions[0]); //TODO: change to available. F.e. If classic loans not available
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectOptions, onSelectOption]);

  //? Recalc cheapest pair on currentLoanValue change
  useEffect(() => {
    if (selectedOption?.value?.type === LoanType.BOND && market) {
      const pair = getCheapestPairForBorrowValue({
        borrowValue: currentLoanValue,
        valuation: market?.oracleFloor?.floor,
        pairs,
        duration: selectedOption.value.duration,
      });

      const bestOrdersAndBorrowValue = getBestOrdersByBorrowValue({
        borrowValue: currentLoanValue,
        collectionFloor: market?.oracleFloor?.floor,
        pairs: pairs.filter((p) =>
          pairLoanDurationFilter({
            pair: p,
            duration: selectedOption.value.duration,
          }),
        ),
      });

      console.log('bestOrdersAndBorrowValue: ', bestOrdersAndBorrowValue);
      console.log(
        'recalculated borrowValue: ',
        bestOrdersAndBorrowValue.takenOrders.reduce(
          (sum, order) => sum + order.orderSize * order.pricePerShare,
          0,
        ),
      );

      const bondOrder: BondOrder = {
        borrowNft: currentNft,
        loanType: LoanType.BOND,
        loanValue: bestOrdersAndBorrowValue.maxBorrowValue,
        bondOrderParams: {
          market,
          orderParams: convertTakenOrdersToOrderParams({
            pairs,
            takenOrders: bestOrdersAndBorrowValue.takenOrders,
          }),

          // [
          //   {
          //     orderSize: bondsAmount,
          //     spotPrice: patchedPair.currentSpotPrice,
          //     pairPubkey: patchedPair.publicKey,
          //   },
          // ],
        },
      };

      setCurrentBondOrder(bondOrder);
      setCurrentPair(pair);
    } else {
      setCurrentBondOrder(null);
      setCurrentPair(null);
    }
  }, [
    market,
    currentLoanValue,
    pairs,
    selectedOption,
    setCurrentPair,
    setCurrentBondOrder,
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
