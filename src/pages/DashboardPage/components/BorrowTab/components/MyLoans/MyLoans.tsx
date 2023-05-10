import { FC } from 'react';

import { NavigationButton } from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';
import { Loan } from '@frakt/api/loans';

import { DashboardColumnValue } from '../../../DashboardStatsValues';
import { calcTotalLoansAmout, getLoansRepayValue } from './helpers';
import { ChartValuesList } from '../../../ChartPie/ChartValuesList';
import { ChartPie } from '../../../ChartPie';
import { defaultsColors } from './constants';

import styles from './MyLoans.module.scss';

const MyLoans: FC<{ loans: Loan[] }> = ({ loans }) => {
  const { totalBorrowed, totalDebt, totalLoans } = calcTotalLoansAmout(loans);

  const { flipValue, perpetualValue, bondValue, graceValue } =
    getLoansRepayValue(loans);

  const loansInfo = [
    { name: 'Flip', key: 'flip', value: flipValue },
    {
      name: 'Perpetual',
      key: 'perpetual',
      value: perpetualValue,
    },
    { name: 'Bond', key: 'bond', value: bondValue },
    { name: 'On grace', key: 'grace', value: graceValue },
  ];

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>My loans</h3>
      <div className={styles.content}>
        <ChartPie
          data={loansInfo}
          label="Loans"
          value={totalLoans}
          className={styles.chart}
        />
        <div className={styles.loansInfoWrapper}>
          <div className={styles.stats}>
            <DashboardColumnValue
              label="Total borrowed"
              value={totalBorrowed}
            />
            <DashboardColumnValue label="Total debt" value={totalDebt} />
          </div>
          <ChartValuesList data={loansInfo} colors={defaultsColors} />
        </div>
      </div>
      <NavigationButton className={styles.button} path={PATHS.LOANS}>
        Manage my loans
      </NavigationButton>
    </div>
  );
};

export default MyLoans;
