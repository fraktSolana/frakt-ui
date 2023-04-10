import { TradePoolAdmin } from '@frakt/api/strategies';
import { create } from 'zustand';

interface SettingsPoolState {
  tradePool: TradePoolAdmin | null;
  setTradePool: (settings: TradePoolAdmin) => void;
  clearTradePool: () => void;
}

export const useSettingsPool = create<SettingsPoolState>((set) => ({
  tradePool: null,
  setTradePool: (settings) =>
    set((state) => ({ ...state, tradePool: settings })),
  clearTradePool: () => set(() => ({ tradePool: null })),
}));
