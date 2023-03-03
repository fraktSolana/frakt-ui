import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames/bind';

import Button from '@frakt/components/Button';
import Tooltip from '@frakt/components/Tooltip';
import CollectionsPreviews from '../CollectionsPreviews';
import { PoolModalStrategy } from '@frakt/components/PoolModalStrategy';

import { useSettingsPool } from '../../hooks/hooks';
import { commonActions } from '@frakt/state/common/actions';
import { PATHS } from '@frakt/constants';
import { TradePool } from '../../types';
import { TabsNames } from '@frakt/components/PoolModalStrategy/types';
import { Solana } from '@frakt/icons';
import styles from './Strategy.module.scss';

interface StrategyProps {
  tradePool: TradePool;
  admin?: boolean;
}

const Strategy: FC<StrategyProps> = ({ tradePool, admin }) => {
  const history = useHistory();
  const wallet = useWallet();

  const [poolModalVisible, setPoolModalVisible] = useState<TabsNames>(null);
  const dispatch = useDispatch();

  const openPoolModal = (tab: TabsNames) => {
    if (!wallet?.connected) {
      dispatch(commonActions.setWalletModal({ isVisible: true }));
    } else {
      setPoolModalVisible(tab);
    }
  };

  const { setTradePool } = useSettingsPool();

  const openAdminPanel = (tradePool: TradePool) => () => {
    history.push(PATHS.STRATEGY_CREATION);
    setTradePool(tradePool);
  };

  return (
    <>
      <div className={styles.strategy}>
        <div className={styles.header}>
          <img src={tradePool?.poolImage} className={styles.image} />
          <div className={styles.title}>{tradePool?.poolName}</div>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.info}>
            <div className={styles.infoTitle}>collections</div>
            <div className={styles.infoValue}>
              <CollectionsPreviews collections={tradePool?.collections} />
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoTitle}>
              <span>deposit yield</span>
              <Tooltip placement="bottom" overlay="deposit yield" />
            </div>
            <div
              className={classNames(styles.infoValue, {
                [styles.negative]: Math.sign(tradePool?.depositYield) === -1,
                [styles.positive]: Math.sign(tradePool?.depositYield) === 1,
              })}
            >
              {tradePool?.depositYield
                ? (tradePool?.depositYield).toFixed(2)
                : 0}{' '}
              %
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoTitle}>total liquidity</div>
            <div className={styles.infoValue}>
              <span>{(tradePool?.totalLiquidity / 1e9).toFixed(2)}</span>
              <Solana className={styles.solana} />
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoTitle}>your liquidity</div>
            <div className={styles.infoValue}>
              <span>
                {(tradePool?.wallet?.userLiquidity / 1e9 || 0).toFixed(2)}
              </span>
              <Solana className={styles.solana} />
            </div>
          </div>
        </div>
        <div className={styles.btnWrapper}>
          {!admin && (
            <Button
              className={styles.btn}
              type="secondary"
              onClick={() => openPoolModal(TabsNames.DEPOSIT)}
            >
              Deposit
            </Button>
          )}

          {tradePool?.isCanEdit && admin && (
            <Button
              className={styles.btn}
              type="secondary"
              onClick={openAdminPanel(tradePool)}
            >
              Manage
            </Button>
          )}

          {!admin && !!tradePool?.wallet?.userLiquidity && (
            <Button
              className={styles.btn}
              type="primary"
              onClick={() => {
                openPoolModal(TabsNames.WITHDRAW);
              }}
            >
              Withdraw all
            </Button>
          )}
        </div>
      </div>

      <PoolModalStrategy
        tradePool={tradePool?.poolPubkey}
        poolModalTab={poolModalVisible}
        visible={poolModalVisible}
        onCancel={() => setPoolModalVisible(null)}
        depositAmount={tradePool?.wallet?.userLiquidity / 1e9 || 0}
        utilizationRate={tradePool?.utilizationRate}
        depositYield={tradePool?.depositYield}
      />
    </>
  );
};

export default Strategy;
