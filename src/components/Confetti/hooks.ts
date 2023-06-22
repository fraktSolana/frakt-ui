import { create } from 'zustand';

interface ConfettiState {
  visible: boolean;
  setVisible: (nextValue: boolean) => void;
}

export const useConfetti = create<ConfettiState>((set) => ({
  visible: false,
  setVisible: (nextValue) => set((state) => ({ ...state, visible: nextValue })),
}));
