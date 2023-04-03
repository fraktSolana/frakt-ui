import { FC, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { AppLayout } from '@frakt/components/Layout/AppLayout';

import { LoansGeneralInfo } from './components/LoansGeneralInfo';
import { LoansPageContent } from './components/LoansPageContent';
import { useWalletLoans } from './hooks';
import { useHiddenLoansPubkeys, useSelectedLoans } from './loansState';
import styles from './LoansPage.module.scss';

const LoansPage: FC = () => {
  const wallet = useWallet();

  const { hiddenLoansPubkeys } = useHiddenLoansPubkeys();

  const { loans, isLoading } = useWalletLoans({
    walletPublicKey: wallet.publicKey,
  });

  //? Filter with optimistic update
  const filteredLoans = useMemo(() => {
    return loans.filter(({ pubkey }) => !hiddenLoansPubkeys.includes(pubkey));
  }, [hiddenLoansPubkeys, loans]);

  return (
    <AppLayout>
      <div className={styles.content}>
        <LoansGeneralInfo allLoans={filteredLoans} />
        <LoansPageContent loans={filteredLoans} isLoading={isLoading} />
      </div>
    </AppLayout>
  );
};

export default LoansPage;
