import { TradePool } from '@frakt/api/strategies';
import { create } from 'zustand';

interface SettingsPoolState {
  tradePool: TradePool | null;
  setTradePool: (settings: TradePool) => void;
  clearTradePool: () => void;
}

export const useSettingsPool = create<SettingsPoolState>((set) => ({
  tradePool: null,
  setTradePool: (settings) =>
    set((state) => ({ ...state, tradePool: settings })),
  clearTradePool: () => set(() => ({ tradePool: null })),
}));
