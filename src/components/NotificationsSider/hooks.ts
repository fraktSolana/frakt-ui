import { create } from 'zustand';
import { useEffect } from 'react';

import { useDialectSdk, useDialectWallet } from '@dialectlabs/react-sdk';

import { ScreenType, DIALECT_APP_PUBLIC_KEY } from './constants';

interface SiderState {
  isVisible: boolean;
  toggleVisibility: () => void;
  setVisibility: (nextValue: boolean) => void;
  screenType: ScreenType;
  changeContentType: (nextState: ScreenType) => void;
}

const useNotificationsSiderState = create<SiderState>((set) => ({
  isVisible: false,
  screenType: ScreenType.SIGN_MESSAGE,
  toggleVisibility: () =>
    set((state) => {
      if (state.isVisible) {
        return {
          ...state,
          isVisible: !state.isVisible,
        };
      }
      return { ...state, isVisible: !state.isVisible };
    }),
  setVisibility: (nextValue) =>
    set((state) => {
      if (state.isVisible) {
        return {
          ...state,
          isVisible: nextValue,
        };
      }
      return { ...state, isVisible: nextValue };
    }),
  changeContentType: (nextState: ScreenType) =>
    set((state) => ({ ...state, screenType: nextState })),
}));

export const useNotificationsSider = () => {
  const { changeContentType, screenType, ...state } =
    useNotificationsSiderState();

  const {
    connectionInitiatedState: { get: connectionInitiatedState },
  } = useDialectWallet();

  const sdk = useDialectSdk(true);

  useEffect(() => {
    if (!connectionInitiatedState) {
      return changeContentType(ScreenType.SIGN_MESSAGE);
    }

    if (connectionInitiatedState) {
      return changeContentType(ScreenType.NOTIFICATIONS);
    }
  }, [connectionInitiatedState, changeContentType]);

  const authorize = async () => {
    try {
      changeContentType(ScreenType.LOADING);

      const addresses = await sdk.wallet.dappAddresses.findAll({
        dappAccountAddress: DIALECT_APP_PUBLIC_KEY,
      });

      if (addresses.length) {
        changeContentType(ScreenType.NOTIFICATIONS);
      } else {
        changeContentType(ScreenType.SETTINGS);
      }
    } catch (error) {
      console.error(error);
      changeContentType(ScreenType.SIGN_MESSAGE);
    }
  };

  return {
    changeContentType,
    screenType,
    ...state,
    authorize,
  };
};
