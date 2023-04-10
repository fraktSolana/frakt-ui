import { FC, Fragment } from 'react';
import { TradePoolUser } from '@frakt/api/strategies';
import Strategy from '../Strategy';

import styles from './Strategies.module.scss';

interface StrategiesProps {
  tradePools: TradePoolUser[];
  admin?: boolean;
}

const Strategies: FC<StrategiesProps> = ({ tradePools, admin }) => {
  return (
    <div className={styles.strategies}>
      {tradePools?.map((tradePool) => (
        <Fragment key={tradePool.publicKey}>
          <Strategy tradePool={tradePool} admin={admin} />
        </Fragment>
      ))}
    </div>
  );
};

export default Strategies;
