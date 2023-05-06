import { FC } from 'react';

import { NavigationButton } from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';
import { Loan } from '@frakt/api/loans';

import { calcTotalLoansAmout, getLoansRepayValue } from './helpers';
import { DashboardStatsValues } from '../DashboardStatsValues';
import { ChartPie } from './components/ChartPie';
import { defaultsColors } from './constants';

import styles from './MyLoans.module.scss';

const MyLoans: FC<{ userLoans: Loan[] }> = ({ userLoans }) => {
  const { totalBorrowed, totalDebt, totalLoans } =
    calcTotalLoansAmout(userLoans);

  const { flipValue, perpetualValue, bondValue, graceValue } =
    getLoansRepayValue(userLoans);

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
        <div className={styles.chart}>
          <ChartPie
            data={loansInfo}
            width={192}
            label="Loans"
            value={totalLoans}
          />
        </div>
        <div className={styles.loansInfoWrapper}>
          <div className={styles.stats}>
            <DashboardStatsValues
              label="Total borrowed"
              value={totalBorrowed}
            />
            <DashboardStatsValues label="Total debt" value={totalDebt} />
          </div>
          <LoansAmountList data={loansInfo} />
        </div>
      </div>
      <NavigationButton className={styles.button} path={PATHS.LOANS}>
        Manage my loans
      </NavigationButton>
    </div>
  );
};

export default MyLoans;

const LoansAmountList = ({ data }) => (
  <div className={styles.loansList}>
    {data.map(({ name, value, key }) => (
      <div key={key} className={styles.row}>
        <div className={styles.loanInfo}>
          <div
            className={styles.dot}
            style={{ background: defaultsColors[key] }}
          />
          <p className={styles.loanName}>{name}</p>
        </div>
        <p className={styles.loanValue}>{value}</p>
      </div>
    ))}
  </div>
);
