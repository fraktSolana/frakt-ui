import { FC } from 'react';
import classNames from 'classnames';

import { convertTakenOrdersToOrderParams } from '@frakt/pages/BorrowPages/cartState';
import { useBondsTransactions } from '@frakt/hooks/useBondTransactions';
import Button from '@frakt/components/Button';
import { Bond } from '@frakt/api/bonds';

import { getMarketAndPairsByBond } from '../helpers';
import { useBondActions } from '../hooks';

import styles from './TableCells.module.scss';

interface ExitCellProps {
  bond: Bond;
  bonds: Bond[];
  hideBond: (bondPubkey: string) => void;
}

export const ExitCell: FC<ExitCellProps> = ({ bond, bonds, hideBond }) => {
  const { market, pairs } = getMarketAndPairsByBond(bond);
  const { isExitAvailable } = bond?.stats;

  const { bestOrdersAndBorrowValue } = useBondActions({
    bond,
    market,
    pairs,
  });

  const { onExit } = useBondsTransactions({ bonds, hideBond, market });
  const isOwner = !!bond?.ownerPubkey;

  return (
    <div className={styles.btnWrapper}>
      {isOwner && (
        <Button
          className={classNames(styles.btn, styles.btnExit)}
          disabled={!isExitAvailable}
          type="primary"
          // onClick={() => setExitModalVisible(true)}
          onClick={() =>
            onExit({
              bond,
              bondOrderParams: convertTakenOrdersToOrderParams({
                pairs,
                takenOrders: bestOrdersAndBorrowValue.takenOrders,
              }),
            })
          }
        >
          Exit
        </Button>
      )}
    </div>
  );
};
