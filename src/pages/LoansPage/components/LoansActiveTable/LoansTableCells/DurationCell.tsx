import classNames from 'classnames';

import { Loan, LoanType } from '@frakt/api/loans';
import { useCountdown } from '@frakt/hooks';

import { checkBondExpired } from '../../LoansActiveTab/hooks';
import styles from '../LoansTable.module.scss';

export const DurationCell = ({
  loan,
  className,
  showGraceBadge = false,
}: {
  loan: Loan;
  className?: string;
  showGraceBadge?: boolean;
}) => {
  const { loanType } = loan;

  if (loanType === LoanType.PRICE_BASED)
    return <span className={styles.value}>Perpetual</span>;

  const expiredAt = getExpiretAtByLoanType(loan);
  const { timeLeft } = useCountdown(expiredAt);

  return (
    <div className={classNames(styles.value, className)}>
      {!!loan?.isGracePeriod && showGraceBadge && (
        <p className={styles.badgeOnGrace}>On grace</p>
      )}
      {timeLeft.days}d<p>:</p>
      {timeLeft.hours}h<p>:</p>
      {timeLeft.minutes}m
    </div>
  );
};

const getExpiretAtByLoanType = (loan: Loan): number => {
  const GRACE_BOND_PERIOD = 12 * 60 * 60; //? 12 hours

  const { loanType, classicParams, gracePeriod, bondParams } = loan;

  const timeBasedexpiredAt = classicParams?.timeBased?.expiredAt;
  const gracePeriodExpiredAt = gracePeriod?.expiredAt;
  const bondExpiredAt = bondParams?.expiredAt;

  const isBondExpired = checkBondExpired(loan);

  const onGracePeriod = !!gracePeriod;

  if (loanType === LoanType.TIME_BASED && !onGracePeriod)
    return timeBasedexpiredAt;

  if (loanType === LoanType.BOND && isBondExpired) {
    return bondExpiredAt + GRACE_BOND_PERIOD;
  }

  if (loanType === LoanType.BOND) return bondExpiredAt;

  return gracePeriodExpiredAt;
};
