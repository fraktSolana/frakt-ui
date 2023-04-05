import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { Loan } from '@frakt/api/loans';

import { LoansHistoryTable } from '../LoansHistoryTable';

import styles from './LoansHistoryTab.module.scss';
// import { useFetchLoansHistory } from './hooks';

interface LoansHistoryTabProps {
  loans: Loan[];
  isLoading: boolean;
}

const LoansHistoryTab: FC<LoansHistoryTabProps> = ({ loans, isLoading }) => {
  const { connected } = useWallet();

  //   const { data, isLoading } = useFetchLoansHistory();
  return (
    <>
      {!connected ? (
        <ConnectWalletSection
          className={styles.emptyList}
          text="Connect your wallet to see my bonds"
        />
      ) : (
        <LoansHistoryTable
          className={styles.rootTable}
          data={loans}
          loading={isLoading}
        />
      )}
    </>
  );
};

export default LoansHistoryTab;
