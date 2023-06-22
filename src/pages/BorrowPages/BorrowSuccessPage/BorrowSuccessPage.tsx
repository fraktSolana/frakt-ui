import { FC, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { PATHS } from '@frakt/constants';
import Button from '@frakt/components/Button';
import { useConfetti } from '@frakt/components/Confetti';

import styles from './BorrowSuccessPage.module.scss';
import { BorrowHeader } from '../components/BorrowHeader';

export const BorrowSuccessPage: FC = () => {
  const { setVisible } = useConfetti();

  useEffect(() => {
    setVisible(true);
  }, [setVisible]);

  return (
    <AppLayout>
      <BorrowHeader title="Borrowing" />
      <div className={styles.wrapper}>
        <h3 className={styles.title}>Congrats! See your NFTs in My loans</h3>
        <NavLink to={PATHS.LOANS}>
          <Button className={styles.btn} type="secondary">
            Loans
          </Button>
        </NavLink>
      </div>
    </AppLayout>
  );
};
