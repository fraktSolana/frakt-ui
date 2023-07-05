import { FC } from 'react';

export enum FilterValue {
  All = 'all',
  Refinance = 'refinance',
  Collateral = 'collateral',
}

export interface FilterOption {
  label: string;
  value: FilterValue;
  icon: FC;
}

export enum SortField {
  NAME = 'name',
  ACTIVE_LOANS = 'activeLoans',
  APR = 'apr',
}

export enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}
