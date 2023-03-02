import { create } from 'zustand';
import { TradePool } from '../types';

interface SettingsPoolState {
  tradePool: TradePool;
  setTradePool: (settings: TradePool) => void;
}

export const useSettingsPool = create<SettingsPoolState>((set) => ({
  tradePool: null,
  setTradePool: (settings) =>
    set((state) => ({ ...state, tradePool: settings })),
}));
