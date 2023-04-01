import create from 'zustand';

interface ChartVisibleState {
  isVisible: boolean;
  toggleVisibility: () => void;
  setVisibility: (nextValue: boolean) => void;
}

export const useChartVisible = create<ChartVisibleState>((set) => ({
  isVisible: false,
  toggleVisibility: () =>
    set((state) => ({ ...state, isVisible: !state.isVisible })),
  setVisibility: (nextValue) =>
    set((state) => ({ ...state, isVisible: nextValue })),
}));
