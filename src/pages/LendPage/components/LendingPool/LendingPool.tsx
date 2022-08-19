import { FC, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import { PoolModal } from '../../../../components/PoolModal';
import Button from '../../../../components/Button';
import styles from './LendingPool.module.scss';
import { TabsNames } from '../../../../components/PoolModal/usePoolModal';
import Tooltip from '../../../../components/Tooltip';
import { commonActions } from '../../../../state/common/actions';
import { LiquidityPool } from '../../../../state/loans/types';
import { sendAmplitudeData } from '../../../../utils/amplitude';
import { SolanaIcon } from '../../../../icons';

interface LendingPoolProps {
  liquidityPool: LiquidityPool;
}

const LendingPool: FC<LendingPoolProps> = ({ liquidityPool }) => {
  const [poolModalVisible, setPoolModalVisible] = useState<TabsNames>(null);
  const { connected } = useWallet();
  const dispatch = useDispatch();

  const {
    name,
    pubkey: liquidityPoolPubkey,
    borrowApr: rawBorrowApr,
    depositApr,
    totalLiquidity,
    totalBorrowed,
    utilizationRate,
    userDeposit,
    isPriceBased,
  } = liquidityPool;

  const openPoolModal = (tab: TabsNames) => {
    if (!connected) {
      dispatch(commonActions.setWalletModal({ isVisible: true }));
    } else {
      setPoolModalVisible(tab);
    }
  };

  const YEAR_APR = 52;
  const borrowApr = isPriceBased ? rawBorrowApr : rawBorrowApr * YEAR_APR;

  return (
    <>
      <div className={styles.pool}>
        <div className={styles.poolCard}>
          <div className={styles.tokenInfo}>
            <LiquidityPoolImage liquidityPool={liquidityPool} />
            <div className={styles.subtitle}>{name || ''}</div>
          </div>
          <div className={styles.statsValue}>
            <div className={styles.totalValue}>
              <p className={styles.title}>Total liquidity</p>
              <p className={styles.value}>
                {totalLiquidity.toFixed(2)} <SolanaIcon />
              </p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>
                Deposit yield
                <Tooltip
                  placement="bottom"
                  overlay="Yearly rewards based on the current utilization rate and borrow interest"
                >
                  <QuestionCircleOutlined className={styles.questionIcon} />
                </Tooltip>
              </p>
              <p className={styles.value}>{depositApr.toFixed(2)} %</p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>
                Borrow interest
                <Tooltip
                  placement="bottom"
                  overlay="The current yearly interest rate paid by borrowers based on the current utilization rate"
                >
                  <QuestionCircleOutlined className={styles.questionIcon} />
                </Tooltip>
              </p>
              <p className={styles.value}>{borrowApr?.toFixed(2) || 0} %</p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>Total borrowed</p>
              <p className={styles.value}>
                {totalBorrowed.toFixed(2)} <SolanaIcon />
              </p>
            </div>
            {connected && (
              <>
                <div className={styles.totalValue}>
                  <p className={styles.title}>Your liquidity</p>
                  <p className={styles.value}>
                    {userDeposit?.depositAmount.toFixed(2) || 0} <SolanaIcon />
                  </p>
                </div>
              </>
            )}
            <div className={styles.btnWrapper}>
              <Button
                className={styles.btn}
                type="primary"
                onClick={() => openPoolModal(TabsNames.WITHDRAW)}
                disabled={connected && !userDeposit?.depositAmount}
              >
                Withdraw
              </Button>
              <Button
                className={styles.btn}
                type="secondary"
                onClick={() => {
                  openPoolModal(TabsNames.DEPOSIT);
                  sendAmplitudeData('loans-deposit');
                }}
              >
                Deposit
              </Button>
            </div>
          </div>
        </div>
      </div>
      <PoolModal
        visible={poolModalVisible}
        onCancel={() => setPoolModalVisible(null)}
        liquidityPoolPubkey={liquidityPoolPubkey}
        apr={depositApr}
        depositAmount={userDeposit?.depositAmount}
        utilizationRate={utilizationRate}
      />
    </>
  );
};

const LiquidityPoolImage: FC<LendingPoolProps> = ({ liquidityPool }) => {
  const { isPriceBased, collectionsAmount } = liquidityPool;

  const showLabelCollectionsAmount = collectionsAmount - 2 > 0;

  return (
    <div
      className={classNames(styles.poolImage, {
        [styles.poolImageWithLabel]:
          !isPriceBased && showLabelCollectionsAmount,
      })}
      data-collections-amount={`+${collectionsAmount - 2}`}
    >
      {liquidityPool.imageUrl?.map((image: string, idx: number) => (
        <img
          src={image}
          className={styles.image}
          key={idx}
          style={idx !== 0 ? { marginLeft: '-25px' } : null}
        />
      ))}
    </div>
  );
};

export default LendingPool;