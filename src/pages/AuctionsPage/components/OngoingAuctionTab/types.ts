export enum FilterValue {
  All = 'all',
  Refinance = 'refinance',
  Collateral = 'collateral',
}

export interface FilterOption {
  label: string;
  value: FilterValue;
  colors: { text: string; background: string };
}
