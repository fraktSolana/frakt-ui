import { FC } from 'react';

import styles from '../BorrowManualTable.module.scss';

interface RepayValueCellProps {
  repayValue: number;
  duration: number;
}

export const RepayValueCell: FC<RepayValueCellProps> = ({
  repayValue,
  duration,
}) => {
  const formattedValue = (repayValue / 1e9 || 0).toFixed(2);

  return (
    <span className={styles.repayValueCell}>
      {formattedValue} ◎ in {duration}d
    </span>
  );
};
