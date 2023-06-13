import { FC } from 'react';

import styles from '../BorrowManualTable.module.scss';

interface InterestValueCellProps {
  bondFee: number;
  bondLoanValue: number;
}

export const InterestValueCell: FC<InterestValueCellProps> = ({
  bondFee,
  bondLoanValue,
}) => {
  const formattedBondFee = (bondFee / 1e9 || 0).toFixed(2);
  const feePercent = ((bondFee / bondLoanValue) * 100 || 0).toFixed(1);

  return (
    <span className={styles.interestValueCell}>
      <span>{formattedBondFee} ◎</span>
      <span>{feePercent}%</span>
    </span>
  );
};
