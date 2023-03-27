import { FC } from 'react';

import { Bond } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';

import styles from './TableCells.module.scss';

export const ProfitCell: FC<{ bond: Bond }> = ({ bond }) => {
  const { estProfit } = bond.stats;

  return (
    <div className={styles.row}>
      <span className={styles.value}>
        {(estProfit || 0).toFixed(3)} <Solana />
      </span>
    </div>
  );
};
