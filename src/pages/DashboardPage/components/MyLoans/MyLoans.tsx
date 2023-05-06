import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { Loan } from '@frakt/api/loans';
import Button from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';

import { ChartPie, defaultColors } from './components/ChartPie';
import { DashboardStatsValues } from '../DashboardStatsValues';
import Block from '../Block';
import { calcLoansAmounts, calcTotalLoansAmout } from './helpers';

import styles from './MyLoans.module.scss';

const MyLoans: FC<{ userLoans: Loan[] }> = ({ userLoans }) => {
  const { totalBorrowed, totalDebt, totalLoans } =
    calcTotalLoansAmout(userLoans);

  const {
    flipRepayValue,
    perpetualRepayValue,
    bondRepayValue,
    graceLoansValue,
  } = calcLoansAmounts(userLoans);

  const loansInfo = [
    { name: 'Flip', value: flipRepayValue?.toFixed(3) },
    { name: 'Perpetual', value: perpetualRepayValue?.toFixed(3) },
    { name: 'Bond', value: bondRepayValue?.toFixed(3) },
    { name: 'On grace', value: graceLoansValue?.toFixed(3) },
  ];

  return (
    <div className={styles.block}>
      <h3 className={styles.title}>My loans</h3>
      <div className={styles.chartWrapper}>
        <div className={styles.chart}>
          <ChartPie
            rawData={loansInfo}
            width={192}
            label="Loans"
            value={totalLoans}
          />
        </div>
        <div className={styles.loansInfoWrapper1}>
          <div className={styles.loansInfoWrapper}>
            <DashboardStatsValues
              label="Total borrowed"
              value={totalBorrowed}
            />
            <DashboardStatsValues label="Total debt" value={totalDebt} />
          </div>
          <LoansAmountList data={loansInfo} />
        </div>
      </div>
      <NavLink
        style={{ width: '100%' }}
        to={userLoans.length ? PATHS.LOANS : PATHS.BORROW_ROOT}
      >
        <Button className={styles.btn} type="secondary">
          {userLoans.length ? 'Repay' : 'Jump to borrowing'}
        </Button>
      </NavLink>
    </div>
  );
};

export default MyLoans;

const LoansAmountList = ({ data }) => (
  <div className={styles.chartInfo}>
    {data.map(({ name, value }, idx) => (
      <div key={idx} className={styles.row}>
        <div className={styles.rowInfo}>
          <div
            className={styles.dot}
            style={{ background: defaultColors[idx] }}
          />
          <p className={styles.name}>{name}</p>
        </div>
        <p className={styles.value}>{value}</p>
      </div>
    ))}
  </div>
);
