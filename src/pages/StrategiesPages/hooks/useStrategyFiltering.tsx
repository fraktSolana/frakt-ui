import { useMemo } from 'react';
import { Control, useForm } from 'react-hook-form';
import { compareNumbers } from '@frakt/utils';
import { TradePoolUser } from '@frakt/api/strategies';

type TradePoolSortValue = {
  label: JSX.Element;
  value: string;
};

type FilterFormFieldsValues = {
  [FilterFormInputsNames.SORT]: TradePoolSortValue;
};

enum SortField {
  NAME = 'name',
  YIELD = 'depositYield',
  TOTAL_LIQUIDITY = 'totalLiquidity',
  USER_LIQUIDITY = 'userLiquidity',
}

enum FilterFormInputsNames {
  SORT = 'sort',
}

export enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

type UseStrategyFiltering = ({
  strategies,
}: {
  strategies: TradePoolUser[] | ReadonlyArray<TradePoolUser>;
}) => {
  control: Control<FilterFormFieldsValues>;
  filteredTradePools: TradePoolUser[];
  sort: TradePoolSortValue;
  setValue: any;
};

export const useStrategyFiltering: UseStrategyFiltering = ({ strategies }) => {
  const { control, watch, setValue } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SORT]: {
        label: <span>Name</span>,
        value: 'name_asc',
      },
    },
  });

  const sort = watch(FilterFormInputsNames.SORT);

  const filteredTradePools = useMemo(() => {
    if (strategies?.length) {
      const [sortField, sortOrder] = sort.value.split('_');

      return [...strategies].sort((poolA, poolB) => {
        if (sortField === SortField.NAME) {
          if (sortOrder === SORT_ORDER.ASC)
            return poolA.name.localeCompare(poolB.name);
          return poolB.name.localeCompare(poolA.name);
        }

        if (sortField === SortField.YIELD) {
          return compareNumbers(
            poolA.depositYield,
            poolB.depositYield,
            sortOrder === 'desc',
          );
        }

        if (sortField === SortField.TOTAL_LIQUIDITY) {
          return compareNumbers(
            poolA.totalLiquidity,
            poolB.totalLiquidity,
            sortOrder === 'desc',
          );
        }

        if (sortField === SortField.USER_LIQUIDITY) {
          return compareNumbers(
            poolA?.wallet?.userLiquidity,
            poolB?.wallet?.userLiquidity,
            sortOrder === 'desc',
          );
        }

        return 0;
      });
    }
    return [];
  }, [strategies, sort.value]);

  return {
    control,
    filteredTradePools,
    sort,
    setValue,
  };
};

export const SORT_VALUES: TradePoolSortValue[] = [
  {
    label: <span>Deposit yield</span>,
    value: 'depositYield_',
  },
  {
    label: <span>Name</span>,
    value: 'name_',
  },
  {
    label: <span>Total liquidity</span>,
    value: 'totalLiquidity_',
  },
  {
    label: <span>Your liquidity</span>,
    value: 'userLiquidity_',
  },
];
