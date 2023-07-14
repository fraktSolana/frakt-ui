import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { create } from 'zustand';

import { signIn } from '@frakt/api/user';

import {
  clearFraktLoginDataLS,
  generateSignature,
  getFraktLoginDataFromLS,
  setFraktLoginDataLS,
} from './functions';
import { ACCESS_TOKEN_LIFE_TIME, AUTH_MESSAGE } from './constants';
import { useIsLedger } from '../useIsLedger';

interface FraktLoginState {
  isLoggingIn: boolean;
  accessToken: string | null;
  setIsLoggingIn: (nextValue: boolean) => void;
  setAccessToken: (nextValue: string | null) => void;
}

const useFraktLoginState = create<FraktLoginState>((set) => ({
  isLoggingIn: false,
  accessToken: null,
  setIsLoggingIn: (nextValue) =>
    set((state) => ({ ...state, isLoggingIn: nextValue })),
  setAccessToken: (nextValue) =>
    set((state) => ({ ...state, accessToken: nextValue })),
}));

export const useFraktLogin = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const { isLoggingIn, setIsLoggingIn, accessToken, setAccessToken } =
    useFraktLoginState();

  const { isLedger } = useIsLedger();

  const logIn = useCallback(async () => {
    if (isLoggingIn) return;
    try {
      setIsLoggingIn(true);
      const signature = await generateSignature({
        isLedger,
        nonce: AUTH_MESSAGE,
        wallet,
        connection,
      });

      if (!signature) return;

      const token = await signIn({
        publicKey: wallet.publicKey,
        signature,
      });

      setFraktLoginDataLS({
        signature,
        token,
        walletPubkey: wallet.publicKey.toBase58(),
        tokenExpiredAt: moment().unix() + ACCESS_TOKEN_LIFE_TIME,
      });

      setAccessToken(token);

      return token;
    } catch (error) {
      clearFraktLoginDataLS();
      setAccessToken(null);

      return null;
    } finally {
      setIsLoggingIn(false);
    }
  }, [
    connection,
    wallet,
    isLoggingIn,
    setIsLoggingIn,
    setAccessToken,
    isLedger,
  ]);

  useEffect(() => {
    if (!wallet.publicKey) return;

    const loginData = getFraktLoginDataFromLS();
    if (!loginData) {
      setAccessToken(null);
      return;
    }

    //? Clear LS data if token is expired
    if (loginData.tokenExpiredAt < moment().unix()) {
      clearFraktLoginDataLS();
      setAccessToken(null);
    }

    //? Clear LS data if user connected different wallet
    if (wallet.publicKey.toBase58() !== loginData.walletPubkey) {
      clearFraktLoginDataLS();
      setAccessToken(null);
    }

    setAccessToken(loginData.token);
  }, [wallet.publicKey, setAccessToken]);

  return {
    accessToken,
    isLoggedIn: !!accessToken,
    isLoggingIn,
    logIn,
  };
};
