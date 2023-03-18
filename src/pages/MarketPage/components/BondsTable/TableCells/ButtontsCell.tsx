import { FC } from 'react';
import classNames from 'classnames';

import { convertTakenOrdersToOrderParams } from '@frakt/pages/BorrowPages/cartState';
import { useBondsTransactions } from '@frakt/hooks/useBondTransactions';
import Button from '@frakt/components/Button';
import { Bond } from '@frakt/api/bonds';

import { useBondCardActions } from '../../BondCard/hooks/useBondCard';
import styles from './TableCells.module.scss';

import { getMarketAndPairsByBond } from '../helpers';

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

  const { exitAvailable, bestOrdersAndBorrowValue } = useBondCardActions({
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
