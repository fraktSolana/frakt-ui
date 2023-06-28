import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import b58 from 'b58';

import { FraktLoginData } from './types';
import { FRAKT_LOGIN_DATA_LS_KEY, MEMO_PROGRAM_ID } from './constants';

export const getFraktLoginDataFromLS = (): FraktLoginData | null =>
  JSON.parse(localStorage.getItem(FRAKT_LOGIN_DATA_LS_KEY)) || null;

export const setFraktLoginDataLS = (loginData: FraktLoginData) =>
  localStorage.setItem(FRAKT_LOGIN_DATA_LS_KEY, JSON.stringify(loginData));

export const clearFraktLoginDataLS = () =>
  localStorage.removeItem(FRAKT_LOGIN_DATA_LS_KEY);

type GenerateSignature = (props: {
  isLedger?: boolean;
  nonce: string;
  wallet: WalletContextState;
  connection: web3.Connection;
}) => Promise<string | null>;
export const generateSignature: GenerateSignature = async ({
  isLedger = false,
  nonce,
  wallet,
  connection,
}) => {
  try {
    if (isLedger) {
      const txn = createAuthTxn(nonce);
      txn.feePayer = wallet.publicKey;
      txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const signedTxn = await wallet.signTransaction(txn);
      const isSignatureValid = validateAuthTxn(signedTxn, nonce);

      if (!isSignatureValid) return null;

      return b58.encode(signedTxn.serialize()) as string;
    }

    const encodedMessage = new TextEncoder().encode(nonce);
    const signature = await wallet.signMessage(encodedMessage);
    return b58.encode(signature);
  } catch (error) {
    return null;
  }
};

export const createAuthTxn = (nonce: string) =>
  new web3.Transaction().add(
    new web3.TransactionInstruction({
      programId: MEMO_PROGRAM_ID,
      keys: [],
      data: Buffer.from(nonce, 'utf8'),
    }),
  );

export const validateAuthTxn = (txn: web3.Transaction, nonce: string) => {
  try {
    const ixn = txn.instructions[0];
    if (!ixn.programId.equals(MEMO_PROGRAM_ID)) return false;
    if (ixn.data.toString() !== nonce) return false;
    if (!txn.verifySignatures()) return false;
    return true;
  } catch (error) {
    return false;
  }
};
