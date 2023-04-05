import { Loan, LoanType } from '@frakt/api/loans';
import { useCountdown } from '@frakt/hooks';

import styles from '../LoansTable.module.scss';

export const DurationCell = ({ loan }: { loan: Loan }) => {
  const { loanType } = loan;

  if (loanType === LoanType.PRICE_BASED)
    return <span className={styles.value}>Perpetual</span>;

  const expiredAt = getExpiretAtByLoanType(loan);
  const { timeLeft } = useCountdown(expiredAt);

  return (
    <div className={styles.value}>
      {!!loan?.gracePeriod && <p className={styles.badgeOnGrace}>On grace</p>}
      {timeLeft.days}d<p>:</p>
      {timeLeft.hours}h<p>:</p>
      {timeLeft.minutes}m
    </div>
  );
};

const getExpiretAtByLoanType = (loan: Loan): number => {
  const { loanType, classicParams, gracePeriod, bondParams } = loan;

  const timeBasedexpiredAt = classicParams?.timeBased?.expiredAt;
  const gracePeriodExpiredAt = gracePeriod?.expiredAt;
  const bondExpiredAt = bondParams?.expiredAt;

  const onGracePeriod = !!gracePeriod;

  if (loanType === LoanType.TIME_BASED && !onGracePeriod)
    return timeBasedexpiredAt;

  if (loanType === LoanType.BOND && !onGracePeriod) return bondExpiredAt;

  return gracePeriodExpiredAt;
};
