import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { create } from 'zustand';

import { Modal } from '@frakt/components/Modal';
import { Button } from '@frakt/components/Button';
import Checkbox from '@frakt/components/Checkbox';
import { CloseModal } from '@frakt/icons';
import { useFraktLogin, useIsLedger } from '@frakt/store';
import { shortenAddress } from '@frakt/utils/solanaUtils';

import styles from './VerifyWalletModal.module.scss';

interface VerifyWalletModalState {
  isOpen: boolean;
  setIsOpen: (nextValue: boolean) => void;
}

export const useVerifyWalletModal = create<VerifyWalletModalState>((set) => ({
  isOpen: false,
  setIsOpen: (nextValue) => set((state) => ({ ...state, isOpen: nextValue })),
}));

export const VerifyWalletModal = () => {
  const wallet = useWallet();
  const { accessToken, logIn } = useFraktLogin();
  const { isLedger, setIsLedger } = useIsLedger();
  const { isOpen, setIsOpen } = useVerifyWalletModal();

  const onCancel = () => setIsOpen(false);

  useEffect(() => {
    if (wallet.connected && !accessToken) {
      return setIsOpen(true);
    }
  }, [wallet.connected, accessToken, setIsOpen]);

  const onVerify = async () => {
    try {
      const accessToken = await logIn();
      if (!accessToken) throw new Error('Access token fetching error');
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      className={styles.modal}
      open={isOpen}
      closable={false}
      onCancel={onCancel}
      width={480}
      footer={false}
      centered
    >
      <div className={styles.closeModalSection}>
        <div className={styles.closeModalIcon} onClick={onCancel}>
          <CloseModal className={styles.closeIcon} />
        </div>
      </div>
      <div className={styles.content}>
        <h3>Your wallet is {shortenAddress(wallet.publicKey?.toBase58())}</h3>
        <p>Verify wallet to prove ownership. No SOL is charged</p>
        <Checkbox
          className={styles.checkbox}
          onChange={() => setIsLedger(!isLedger)}
          label="I use ledger"
          checked={isLedger}
        />
        <Button onClick={onVerify} type="secondary" className={styles.btn}>
          Verify wallet
        </Button>
      </div>
    </Modal>
  );
};
