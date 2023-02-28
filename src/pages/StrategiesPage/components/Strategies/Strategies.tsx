import { FC, Fragment } from 'react';

import Strategy from '../Strategy';

import styles from './Strategies.module.scss';

const Strategies: FC<any> = ({ tradePools, admin }) => {
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
