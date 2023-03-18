interface Breakpoints {
  mobile?: number;
  scrollX?: number;
  scrollY?: number;
}

export type PartialBreakpoints = Partial<Breakpoints>;

export interface ActiveRowParams {
  field: string;
  value: string;
}
