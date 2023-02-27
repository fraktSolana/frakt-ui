import { create } from 'zustand';

interface SettingsPoolState {
  tradePool: any;
  setSettings: (settings: any) => void;
}

export const useSettingsPool = create<SettingsPoolState>((set) => ({
  tradePool: null,
  setSettings: (settings) =>
    set((state) => ({ ...state, tradePool: settings })),
}));
