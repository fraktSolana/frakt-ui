import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { Loan } from '@frakt/api/loans';

import styles from './LoansPageContent.module.scss';
import { LoansTable } from '../LoansTable';

interface LoansPageContentProps {
  loans: Loan[];
  isLoading: boolean;
}

export const LoansPageContent: FC<LoansPageContentProps> = ({
  loans,
  isLoading,
}) => {
  const { connected } = useWallet();

  return (
    <div className={styles.container}>
      {connected ? (
        <LoansTable data={loans} loading={isLoading} />
      ) : (
        <ConnectWalletSection text="Connect your wallet to check if you have any active loans" />
      )}
    </div>
  );
};
