import { FC } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import moment from 'moment';

import { convertTakenOrdersToOrderParams } from '@frakt/pages/BorrowPages/cartState';
import { useBondsTransactions } from '@frakt/hooks';
import { claimNftByLender, isReceiveNftFeature } from '@frakt/utils/bonds';
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
  const wallet = useWallet();
  const { connection } = useConnection();

  const { market, pairs } = getMarketAndPairsByBond(bond);
  const { isExitAvailable, pnlProfit } = bond?.stats;
  const { bestOrdersAndBorrowValue } = useBondActions({
    bond,
    market,
    pairs,
  });

  const { onExit } = useBondsTransactions({
    bonds,
    hideBond,
    market,
  });
  const isOwner = !!bond?.ownerPubkey;

  const onClaim = async () => {
    try {
      const result = await claimNftByLender({
        wallet,
        connection,
        bond,
      });

      if (result) {
        hideBond(bond?.fbond?.publicKey);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isAvailableToClaim = checkIsAvailableToClaimNft(bond);

  return (
    <div className={styles.btnWrapper}>
      {isOwner && !isAvailableToClaim && (
        <Button
          className={classNames(styles.btn, styles.btnExit, {
            [styles.positive]: pnlProfit > 0,
          })}
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
      {isAvailableToClaim && (
        <Button onClick={onClaim} className={styles.btn} type="secondary">
          Claim
        </Button>
      )}
    </div>
  );
};

const checkIsAvailableToClaimNft = (bond: Bond): boolean => {
  const { autocompoundDeposits, fbond } = bond;
  const bondFeature = autocompoundDeposits[0].bondTradeTransactionType;

  if (autocompoundDeposits?.length > 1) {
    return false;
  }

  if (!isReceiveNftFeature(bondFeature)) {
    return false;
  }

  if (moment.unix(fbond.liquidatingAt).add(12, 'hours').isAfter(moment())) {
    return false;
  }

  if (fbond.fraktBondState !== 'active') {
    return false;
  }

  return true;
};
