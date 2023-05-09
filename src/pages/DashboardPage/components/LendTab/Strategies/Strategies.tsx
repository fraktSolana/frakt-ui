import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { NavigationButton } from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';

import { useTradePools } from '@frakt/utils/strategies';

import styles from './Strategies.module.scss';
import Heading from '../../Heading';
import LendList from '../LendList';

const Strategies: FC = () => {
  const { publicKey } = useWallet();
  const { tradePools, isLoading } = useTradePools({
    walletPublicKey: publicKey?.toBase58(),
  });

  return (
    <div className={styles.container}>
      <Heading title="Strategies" tooltipText="Strategies" />
      <LendList data={tradePools} isLoading={isLoading} />
      <NavigationButton className={styles.button} path={PATHS.STRATEGIES}>
        See all
      </NavigationButton>
    </div>
  );
};

export default Strategies;
