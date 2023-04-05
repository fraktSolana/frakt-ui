import { FC } from 'react';
import { Loan } from '@frakt/api/loans';

import styles from '../LoansTable.module.scss';

export const StakingSupportCell: FC<{ loan: Loan }> = ({ loan }) => {
  const isSupportStaking = loan?.classicParams?.rewards?.stakeState;

  if (!isSupportStaking) return <></>;
  return <div className={styles.badge}>Staking support</div>;
};
