import create from 'zustand';

interface ChartBondsState {
  isVisible: boolean;
  toggleVisibility: () => void;
  setVisibility: (nextValue: boolean) => void;
}

export const useBondChart = create<ChartBondsState>((set) => ({
  isVisible: false,
  toggleVisibility: () =>
    set((state) => ({ ...state, isVisible: !state.isVisible })),
  setVisibility: (nextValue) =>
    set((state) => ({ ...state, isVisible: nextValue })),
}));
