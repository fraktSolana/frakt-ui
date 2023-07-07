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
  APY = 'apy',
  PRINCIPLE = 'principle',
}

export enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}
