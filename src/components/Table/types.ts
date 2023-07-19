import { Option } from '../SortDropdown';
import { TableProps } from './Table';

interface Breakpoints {
  mobile: number;
  scrollX: number;
  scrollY: number;
}
export type PartialBreakpoints = Partial<Breakpoints>;

export type TablePropsWithSortProps<T> = TableProps<T>;

interface SearchParams {
  searchField: string | string[];
  debounceWait: number;
  placeHolderText: string;
}
export type PartialSearchParams = Partial<SearchParams>;

export interface SortParams {
  onChange: (option: Option) => void;
  option: Option;
  className?: string;
}

export interface ToggleParams {
  onChange: (value: boolean) => void;
  checked: boolean;
  label: string;
}

export interface ActiveRowParams {
  field?: string;
  value?: any;
  className?: string;
  cardClassName?: string;
}

export interface ViewParams {
  showCard: boolean;
  showSearching: boolean;
}

export interface Sort {
  field: string | null;
  direction: 'desc' | 'asc';
}
