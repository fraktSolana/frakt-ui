import { FC } from 'react';
import classNames from 'classnames';

import { convertTakenOrdersToOrderParams } from '@frakt/pages/BorrowPages/cartState';
import { useBondsTransactions } from '@frakt/hooks/useBondTransactions';
import Button from '@frakt/components/Button';
import { Bond } from '@frakt/api/bonds';

import { getMarketAndPairsByBond } from '../helpers';
import { useBondActions } from '../hooks';

import styles from './TableCells.module.scss';

interface ButtontsCellProps {
  bond: Bond;
  bonds: Bond[];
  hideBond: (bondPubkey: string) => void;
}

export const ButtontsCell: FC<ButtontsCellProps> = ({
  bond,
  bonds,
  hideBond,
}) => {
  const { market, pairs } = getMarketAndPairsByBond(bond);

  const { exitAvailable, bestOrdersAndBorrowValue } = useBondActions({
    bond,
    market,
    pairs,
  });

  // const isOwner =
  //   publicKey?.toBase58() === bond?.fbond?.bondCollateralOrSolReceiver;

  const { onExit } = useBondsTransactions({ bonds, hideBond, market });

  return (
    <div className={styles.btnWrapper}>
      <Button
        className={classNames(styles.btn, styles.btnExit)}
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
