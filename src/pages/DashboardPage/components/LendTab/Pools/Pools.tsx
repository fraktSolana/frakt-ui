import { FC } from 'react';
import { NavigationButton } from '@frakt/components/Button';
import { useWallet } from '@solana/wallet-adapter-react';

import { useTradePools } from '@frakt/utils/strategies';
import { PATHS } from '@frakt/constants';

import Heading from '../../Heading';
import LendList from '../LendList';

import styles from './Pools.module.scss';

const Pools: FC = () => {
  const { publicKey } = useWallet();
  const { tradePools, isLoading } = useTradePools({
    walletPublicKey: publicKey?.toBase58(),
  });

  return (
    <div className={styles.container}>
      <Heading title="Pools" tooltipText="Pools" />
      <LendList data={tradePools} isLoading={isLoading} />
      <NavigationButton className={styles.button} path={PATHS.STRATEGIES}>
        See all
      </NavigationButton>
    </div>
  );
};

export default Pools;
