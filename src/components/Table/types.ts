interface Breakpoints {
  mobile: number;
  scrollX: number;
  scrollY: number;
}
export type PartialBreakpoints = Partial<Breakpoints>;

interface SearchParams {
  searchField: string | string[];
  debounceWait: number;
  placeHolderText: string;
}
export type PartialSearchParams = Partial<SearchParams>;

export interface ActiveRowParams {
  field: string;
  value?: string;
  className?: string;
}

export interface ViewParams {
  showCard: boolean;
  showSorting: boolean;
}

export interface SelectLoansParams {
  onChange: () => void;
  selected: boolean;
}
