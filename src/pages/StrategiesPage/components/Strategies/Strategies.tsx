import { FC, Fragment } from 'react';

import Strategy from '../Strategy';

import styles from './Strategies.module.scss';

const Strategies: FC<any> = ({ tradePools, admin }) => {
  return (
    <div className={styles.strategies}>
      {tradePools?.map((tradePool) => (
        <Fragment key={tradePool.poolPubkey}>
          <Strategy
            tradePool={tradePool}
            admin={admin}
            // poolPubkey={poolPubkey}
            // poolName={poolName}
            // poolImage={poolImage}
            // depositYield={depositYield}
            // collections={collections}
            // totalLiquidity={totalLiquidity}
            // utilizationRate={utilizationRate}
            // isCanEdit={isCanEdit}
            // settings={settings}
            // userWallet={wallet}
          />
        </Fragment>
      ))}
    </div>
  );
};

export default Strategies;
