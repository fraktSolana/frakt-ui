import { FC, useState } from 'react';

import img from './mockPreview.jpg';
import Button from '@frakt/components/Button';
import Tooltip from '@frakt/components/Tooltip';
import CollectionsPreviews from '../CollectionsPreviews';

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Solana } from '@frakt/icons';
import styles from './Strategy.module.scss';
import classNames from 'classnames/bind';
import { PoolModal } from '@frakt/components/PoolModal';
import { useWallet } from '@solana/wallet-adapter-react';
import { TabsNames } from '@frakt/components/PoolModal/types';
import { useDispatch } from 'react-redux';
import { commonActions } from '@frakt/state/common/actions';
import { useDeposit } from '../../StrategyCreationPage/hooks/useDeposit';

const Strategy: FC<any> = ({
  poolName,
  poolImage,
  depositYield,
  collections,
  totalLiquidity,
}) => {
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

  const { onCreateInvestment, loadingModalVisible, closeLoadingModal } =
    useDeposit();

  return (
    <>
      <div className={styles.strategy}>
        <div className={styles.header}>
          <img src={poolImage} className={styles.image} />
          <div className={styles.title}>{poolName}</div>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.info}>
            <div className={styles.infoTitle}>collections</div>
            <div className={styles.infoValue}>
              <CollectionsPreviews collections={collections} />
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoTitle}>
              <span>deposit yield</span>
              <Tooltip
                placement="bottom"
                overlay="Yearly rewards based on the current utilization rate and borrow interest"
              >
                <QuestionCircleOutlined className={styles.questionIcon} />
              </Tooltip>
            </div>
            <div
              className={classNames(styles.infoValue, {
                [styles.negative]: Math.sign(depositYield) === -1,
                [styles.positive]: Math.sign(depositYield) === 1,
              })}
            >
              {Math.round(depositYield)} %
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoTitle}>total liquidity</div>
            <div className={styles.infoValue}>
              <span>{(totalLiquidity / 1e9).toFixed(2)}</span>
              <Solana className={styles.solana} />
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoTitle}>your liquidity</div>
            <div className={styles.infoValue}>
              <span>0</span>
              <Solana className={styles.solana} />
            </div>
          </div>
        </div>
        <div className={styles.btnWrapper}>
          <Button
            className={styles.btn}
            type="secondary"
            onClick={() => openPoolModal(TabsNames.DEPOSIT)}
          >
            Deposit
          </Button>
          {/* <Button
          className={styles.btn}
          type="secondary"
          // onClick={() => {
          //   openPoolModal(TabsNames.DEPOSIT);
          //   sendAmplitudeData('loans-deposit');
          // }}
        >
          Manage
        </Button>
        <Button
          className={styles.btn}
          type="primary"
          // onClick={() => {
          //   openPoolModal(TabsNames.DEPOSIT);
          //   sendAmplitudeData('loans-deposit');
          // }}
        >
          Withdraw all
        </Button> */}
        </div>
      </div>

      <PoolModal
        onClick={onCreateInvestment}
        visible={poolModalVisible}
        onCancel={() => setPoolModalVisible(null)}
        liquidityPoolPubkey={'liquidityPoolPubkey'}
        apr={depositYield}
        utilizationRate={33}
      />
    </>
  );
};

export default Strategy;
