import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import Strategy from '../Strategy';
import { PoolModal } from '@frakt/components/PoolModal';
import { TabsNames } from '@frakt/components/PoolModal/types';
import { commonActions } from '@frakt/state/common/actions';
import styles from './Strategies.module.scss';

const Strategies: FC<any> = () => {
  const [poolModalVisible, setPoolModalVisible] = useState<TabsNames>(null);
  const { connected } = useWallet();
  const dispatch = useDispatch();

  const openPoolModal = (tab: TabsNames) => {
    if (!connected) {
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
