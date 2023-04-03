import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { Loan } from '@frakt/api/loans';

import { LoansList } from '../LoansList';

import styles from './LoansPageContent.module.scss';

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
        <LoansList loans={loans} isLoading={isLoading} />
      ) : (
        <ConnectWalletSection text="Connect your wallet to check if you have any active loans" />
      )}
    </div>
  );
};
