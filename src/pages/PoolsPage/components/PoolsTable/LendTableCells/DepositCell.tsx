import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { LiquidityPool } from '@frakt-protocol/frakt-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { harvestLiquidity as harvestTxn } from '@frakt/utils/loans';
import { PoolModal, TabsNames } from '@frakt/components/PoolModal';
import { commonActions } from '@frakt/state/common/actions';
import { Button } from '@frakt/components/Button';
import Tooltip from '@frakt/components/Tooltip';
import { useConnection } from '@frakt/hooks';

import styles from '../PoolsTable.module.scss';

interface DepositCellProps {
  liquidityPool: LiquidityPool;
  isCardView: boolean;
}

const MIN_AVAILABLE_VALUE_FOR_HARVEST = 0.001;

export const DepositCell: FC<DepositCellProps> = ({
  liquidityPool,
  isCardView,
}) => {
  const connection = useConnection();
  const wallet = useWallet();

  const dispatch = useDispatch();

  const [poolModalVisible, setPoolModalVisible] = useState<TabsNames>(null);

  const openPoolModal = (tab: TabsNames) => {
    if (!wallet.connected) {
      dispatch(commonActions.setWalletModal({ isVisible: true }));
    } else {
      setPoolModalVisible(tab);
    }
  };

  const {
    pubkey: liquidityPoolPubkey,
    depositApr,
    utilizationRate,
    userDeposit,
  } = liquidityPool;

  const depositAmount = userDeposit?.depositAmount;
  const harvestAmount = userDeposit?.harvestAmount;

  const isDisabledHarvestBtn = harvestAmount < MIN_AVAILABLE_VALUE_FOR_HARVEST;

  const onHarvest = async () => {
    await harvestTxn({
      connection,
      wallet,
      liquidityPool: liquidityPool?.pubkey,
    });
  };

  const renderHarvestButton = () => {
    if (isDisabledHarvestBtn) {
      return (
        <Tooltip placement="top" overlay="Harvest is available from 0.001 SOL">
          <div>
            <Button
              className={classNames(styles.button, {
                [styles.cardView]: isCardView,
              })}
              disabled
            >
              Harvest
            </Button>
          </div>
        </Tooltip>
      );
    } else {
      return (
        <Button
          onClick={onHarvest}
          className={styles.button}
          disabled={!harvestAmount}
        >
          Harvest
        </Button>
      );
    }
  };

  return (
    <>
      <div
        className={classNames(styles.buttonWrapper, {
          [styles.cardView]: isCardView,
        })}
      >
        <Button
          className={styles.button}
          type="secondary"
          onClick={() => openPoolModal(TabsNames.DEPOSIT)}
        >
          {wallet.connected && !!depositAmount ? 'Manage' : 'Deposit'}
        </Button>
        {renderHarvestButton()}
      </div>
      <PoolModal
        visible={poolModalVisible}
        onCancel={() => setPoolModalVisible(null)}
        poolPubkey={liquidityPoolPubkey}
        depositYield={depositApr}
        depositAmount={userDeposit?.depositAmount}
        utilizationRate={utilizationRate}
      />
    </>
  );
};
