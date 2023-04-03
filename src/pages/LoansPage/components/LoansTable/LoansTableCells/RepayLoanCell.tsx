import { FC } from 'react';

import { Button } from '@frakt/components/Button';

import styles from '../LoansTable.module.scss';

export const RepayLoanCell: FC = () => {
  return (
    <Button type="secondary" className={styles.repayButton}>
      Repay
    </Button>
  );
};
