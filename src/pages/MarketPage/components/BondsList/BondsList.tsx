import { FC } from 'react';

import { Bond } from '@frakt/api/bonds';

import { BondsTable } from '../BondsTable';
import styles from './BondsList.module.scss';

interface BondsListProps {
  bonds: Bond[];
  hideBond: (bondPubkey: string) => void;
}

export const BondsList: FC<BondsListProps> = ({ bonds, hideBond }) => {
  return (
    <div className={styles.bondList}>
      <BondsTable
        data={bonds}
        hideBond={hideBond}
        noDataClassName={styles.noDataMessage}
      />
    </div>
  );
};
