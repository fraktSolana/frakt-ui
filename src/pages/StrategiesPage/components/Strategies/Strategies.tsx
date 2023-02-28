import { FC, Fragment } from 'react';
import { TradePool } from '../../types';

import Strategy from '../Strategy';

import styles from './Strategies.module.scss';

interface StrategiesProps {
  tradePools: TradePool[];
  admin?: boolean;
}

const Strategies: FC<StrategiesProps> = ({ tradePools, admin }) => {
  return (
    <div className={styles.strategies}>
      {tradePools?.map((tradePool) => (
        <Fragment key={tradePool.poolPubkey}>
          <Strategy tradePool={tradePool} admin={admin} />
        </Fragment>
      ))}
    </div>
  );
};

export default Strategies;
