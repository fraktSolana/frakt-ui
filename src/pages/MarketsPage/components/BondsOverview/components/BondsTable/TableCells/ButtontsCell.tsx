import { FC } from 'react';
import classNames from 'classnames';

import { convertTakenOrdersToOrderParams } from '@frakt/pages/BorrowPages/cartState';
import { useBondsTransactions } from '@frakt/hooks/useBondTransactions';
import Button from '@frakt/components/Button';
import { Bond } from '@frakt/api/bonds';

import { getMarketAndPairsByBond } from '../helpers';
import styles from './TableCells.module.scss';
import { useBondActions } from '../hooks';

interface ButtontsCellProps {
  bond: Bond;
  isMobile?: boolean;
  bonds: Bond[];
  hideBond: (bondPubkey: string) => void;
}

export const ButtontsCell: FC<ButtontsCellProps> = ({
  bond,
  bonds,
  isMobile,
  hideBond,
}) => {
  const { market, pairs } = getMarketAndPairsByBond(bond);

  const { exitAvailable, bestOrdersAndBorrowValue } = useBondActions({
    bond,
    market,
    pairs,
  });

  const { onExit } = useBondsTransactions({ bonds, hideBond, market });

  return (
    <div className={styles.btnWrapper}>
      <Button
        className={classNames(
          styles.btn,
          { [styles.btnMobile]: isMobile },
          styles.btnExit,
        )}
        disabled={!exitAvailable}
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
    </div>
  );
};
