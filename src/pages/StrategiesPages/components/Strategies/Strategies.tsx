import { FC, Fragment } from 'react';
import { TradePoolUser } from '@frakt/api/strategies';
import Strategy from '../Strategy';

import styles from './Strategies.module.scss';
import { Loader } from '@frakt/components/Loader';

interface StrategiesProps {
  tradePools: TradePoolUser[];
  admin?: boolean;
  isLoading: boolean;
}

const Strategies: FC<StrategiesProps> = ({ tradePools, admin, isLoading }) => {
  return (
    <div className={styles.strategies}>
      {!tradePools.length && isLoading && <Loader size="large" />}

      {!!tradePools.length && !isLoading && (
        <>
          {tradePools.map((tradePool) => (
            <Fragment key={tradePool.publicKey}>
              <Strategy tradePool={tradePool} admin={admin} />
            </Fragment>
          ))}
        </>
      )}
    </div>
  );
};

export default Strategies;
