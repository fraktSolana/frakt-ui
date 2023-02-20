import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

import Strategy from '../Strategy';
import { PoolModal } from '@frakt/components/PoolModal';
import { TabsNames } from '@frakt/components/PoolModal/types';
import { commonActions } from '@frakt/state/common/actions';
import styles from './Strategies.module.scss';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAdminTradePools } from '@frakt/utils/Strategies/hooks';

const Strategies: FC<any> = () => {
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
  return (
    <>
      <div className={styles.strategies}>
        <Strategy onClick={() => openPoolModal(TabsNames.DEPOSIT)} />
        <Strategy onClick={() => openPoolModal(TabsNames.DEPOSIT)} />
        <Strategy onClick={() => openPoolModal(TabsNames.DEPOSIT)} />
        <Strategy onClick={() => openPoolModal(TabsNames.DEPOSIT)} />
      </div>

      <PoolModal
        visible={poolModalVisible}
        onCancel={() => setPoolModalVisible(null)}
        liquidityPoolPubkey={'liquidityPoolPubkey'}
        apr={12}
        depositAmount={22}
        utilizationRate={33}
      />
    </>
  );
};

export default Strategies;
