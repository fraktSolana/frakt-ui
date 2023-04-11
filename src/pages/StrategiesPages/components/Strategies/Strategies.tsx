import { FC, Fragment } from 'react';

import Strategy from '../Strategy';
import { Loader } from '@frakt/components/Loader';
import { TradePoolUser } from '@frakt/api/strategies';
import styles from './Strategies.module.scss';

interface StrategiesProps {
  tradePools: TradePoolUser[];
  isAdmin?: boolean;
  isLoading: boolean;
}

const Strategies: FC<StrategiesProps> = ({
  tradePools,
  isAdmin,
  isLoading,
}) => {
  return (
    <div className={styles.strategies}>
      {!tradePools.length && isLoading && <Loader size="large" />}

      {!!tradePools.length && !isLoading && (
        <>
          {tradePools.map((tradePool) => (
            <Fragment key={tradePool.publicKey}>
              <Strategy tradePool={tradePool} isAdmin={isAdmin} />
            </Fragment>
          ))}
        </>
      )}
    </div>
  );
};

export default Strategies;
