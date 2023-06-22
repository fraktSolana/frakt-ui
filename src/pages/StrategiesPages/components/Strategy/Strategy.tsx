import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { TabsNames } from '@frakt/components/PoolModal/types';
import { PoolModal } from '@frakt/components/PoolModal';
import { TradePoolUser } from '@frakt/api/strategies';
import Tooltip from '@frakt/components/Tooltip';
import Button from '@frakt/components/Button';
import { Solana } from '@frakt/icons';
import { useWalletModal } from '@frakt/components/WalletModal';

import CollectionsPreviews from '../CollectionsPreviews';
import { calcWithdrawValue } from './helpers';

import styles from './Strategy.module.scss';

interface StrategyProps {
  tradePool: TradePoolUser;
  isAdmin?: boolean;
}

const Strategy: FC<StrategyProps> = ({ tradePool, isAdmin }) => {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();

  const [poolModalVisible, setPoolModalVisible] = useState<TabsNames>(null);

  const openPoolModal = (tab: TabsNames) => {
    if (!wallet?.connected) {
      setVisible(true);
    } else {
      setPoolModalVisible(tab);
    }
  };

  // const { setTradePool } = useSettingsPool();

  // const openAdminPanel = (tradePool: TradePoolAdmin) => () => {
  //   history.push(PATHS.STRATEGY_CREATION);
  //   setTradePool(tradePool);
  // };

  const withdrawValue = calcWithdrawValue(tradePool);
  const utilizationRate = (1e4 - tradePool?.reserveFundsRatio) / 100;

  return (
    <>
      <div className={styles.strategy}>
        <div className={styles.header}>
          <img src={tradePool?.image} className={styles.image} />
          <div className={styles.title}>{tradePool?.name}</div>
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
              <Tooltip
                placement="bottom"
                overlay="Yearly rewards based on the current utilization rate and borrow interest"
              />
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
          {!isAdmin && (
            <Button
              className={styles.btn}
              type="secondary"
              onClick={() => openPoolModal(TabsNames.DEPOSIT)}
            >
              Deposit
            </Button>
          )}
          {/* 
          {tradePool?.isCanEdit && isAdmin && (
            <Button
              className={styles.btn}
              type="secondary"
              onClick={openAdminPanel(tradePool)}
            >
              Manage
            </Button>
          )} */}

          {!isAdmin && !!withdrawValue && (
            <Button
              className={styles.btn}
              type="primary"
              onClick={() => {
                openPoolModal(TabsNames.WITHDRAW);
              }}
            >
              Withdraw
            </Button>
          )}
        </div>
      </div>

      <PoolModal
        isTradePool
        poolPubkey={tradePool?.publicKey}
        visible={poolModalVisible}
        onCancel={() => setPoolModalVisible(null)}
        depositAmount={Math.floor(withdrawValue * 100) / 100}
        utilizationRate={utilizationRate}
        depositYield={tradePool?.depositYield}
      />
    </>
  );
};

export default Strategy;
