import { filter, sum, map } from 'lodash';

import { Loan } from '@frakt/api/loans';

export const getLoansRepayValue = (userLoans: Loan[]) => {
  const flipLoans = filter(userLoans, { loanType: 'timeBased' });
  const perpetualLoans = filter(userLoans, { loanType: 'priceBased' });
  const bondLoans = filter(userLoans, { loanType: 'bond' });
  const graceLoans = filter(userLoans, 'gracePeriod');

  const removeGraceLoans = (loan: Loan) => !loan?.gracePeriod;

  const flipLoansWithoutGrace = filter(flipLoans, removeGraceLoans);
  const perpetualLoansWithoutGrace = filter(perpetualLoans, removeGraceLoans);

  const perpetualRepayValue = sum(
    map(perpetualLoansWithoutGrace, 'repayValue'),
  );
  const flipRepayValue = sum(map(flipLoansWithoutGrace, 'repayValue'));
  const bondRepayValue = sum(map(bondLoans, 'repayValue'));
  const graceLoansValue = sum(map(graceLoans, 'repayValue'));

  return {
    flipValue: (flipRepayValue / 1e9)?.toFixed(3),
    perpetualValue: (perpetualRepayValue / 1e9)?.toFixed(3),
    bondValue: (bondRepayValue / 1e9)?.toFixed(3),
    graceValue: (graceLoansValue / 1e9)?.toFixed(3),
  };
};

export const calcTotalLoansAmout = (userLoans: Loan[]) => {
  const totalBorrowed = sum(map(userLoans, 'loanValue'));
  const totalDebt = sum(map(userLoans, 'repayValue'));
  const totalLoans = userLoans.length;

  return {
    totalBorrowed: totalBorrowed / 1e9,
    totalDebt: totalDebt / 1e9,
    totalLoans,
  };
};
