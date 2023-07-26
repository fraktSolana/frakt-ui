import { create } from 'zustand';

import { MOBILE_WIDTH } from '@frakt/constants';

type ViewState = 'table' | 'card';

interface TableViewState {
  viewState: ViewState;
  setViewState: (nextValue: ViewState) => void;
}

export const useTableView = create<TableViewState>((set) => {
  const isMobileWidth = window.innerWidth < MOBILE_WIDTH;

  const initialState: TableViewState = {
    viewState: isMobileWidth ? 'card' : 'table',
    setViewState: (nextValue) =>
      set((state) => ({ ...state, viewState: nextValue })),
  };

  return initialState;
});
