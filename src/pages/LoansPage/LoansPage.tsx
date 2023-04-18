import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { AppLayout } from '@frakt/components/Layout/AppLayout';

import { LoansGeneralInfo } from './components/LoansGeneralInfo';
import { LoansPageContent } from './components/LoansPageContent';
import { useWalletLoans } from './hooks';

import styles from './LoansPage.module.scss';

const LoansPage: FC = () => {
  const wallet = useWallet();

  //TODO Replace with another request
  const { loans } = useWalletLoans({ walletPublicKey: wallet.publicKey });

  return (
    <AppLayout>
      <div className={styles.content}>
        <LoansGeneralInfo allLoans={loans} />
        <LoansPageContent />
      </div>
    </AppLayout>
  );
};

export default LoansPage;
