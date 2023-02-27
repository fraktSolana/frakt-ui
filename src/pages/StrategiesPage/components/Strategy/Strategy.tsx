import { FC, useState } from 'react';

import Button from '@frakt/components/Button';
import Tooltip from '@frakt/components/Tooltip';
import CollectionsPreviews from '../CollectionsPreviews';

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Solana } from '@frakt/icons';
import styles from './Strategy.module.scss';
import classNames from 'classnames/bind';

import { useWallet } from '@solana/wallet-adapter-react';

import { useDispatch } from 'react-redux';
import { commonActions } from '@frakt/state/common/actions';
import { useDeposit } from '../../StrategyCreationPage/hooks/useDeposit';
import { TabsNames } from '@frakt/components/PoolModalStrategy/types';
import { PoolModalStrategy } from '@frakt/components/PoolModalStrategy';
import { PATHS } from '@frakt/constants';
import { useHistory } from 'react-router-dom';
import { useStrategyCreation } from '../../StrategyCreationPage/hooks/useStrategyCreation';
import { useSettingsPool } from '../../hooks';

const Strategy: FC<any> = ({
  tradePool,
  admin,
  // poolName,
  // poolImage,
  // depositYield,
  // collections,
  // totalLiquidity,
  // utilizationRate,
  // poolPubkey,
  // isCanEdit,
  // settings,
  // userWallet,
}) => {
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

  // console.log(poolModalVisible);

  // const { tradePoolsAdmin, isLoading } = useAdminTradePools({
  //   walletPublicKey: wallet?.publicKey?.toBase58(),
  // });
  // const {
  //   formValues,
  //   setFormValues,
  //   checkDisabled,
  //   onCreateStrategy,
  //   onUpdateStrategy,
  //   loadingModalVisible,
  //   closeLoadingModal,
  // } = useStrategyCreation(settings);

  const { setSettings } = useSettingsPool();

  const openAdminPanel = (tradePool) => () => {
    history.push(PATHS.STRATEGY_CREATION);
    // console.log(tradePool);

    console.log('tradePools', tradePool);
    setSettings(tradePool);
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
              {Math.round(tradePool?.depositYield)} %
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

          {!admin && tradePool?.wallet?.userLiquidity && (
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
