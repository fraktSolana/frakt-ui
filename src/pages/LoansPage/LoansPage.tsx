import { FC } from 'react';

import { AppLayout } from '../../components/Layout/AppLayout';
import { MyLoansList } from './components/MyLoansList';
import BorrowBanner from '../../components/BorrowBanner';
import { Container } from '../../components/Layout';
import styles from './LoansPage.module.scss';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

const LoansPage: FC = () => {
  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Loans</h1>
            <h2 className={styles.subtitle}>My loans list</h2>
          </div>
          <BorrowBanner />
        </div>
        <MyLoansList />
      </Container>
    </AppLayout>
  );
};

export default LoansPage;
