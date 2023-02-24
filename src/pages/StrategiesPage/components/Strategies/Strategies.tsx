import { FC, Fragment } from 'react';

import Strategy from '../Strategy';

import styles from './Strategies.module.scss';

const Strategies: FC<any> = ({ tradePools }) => {
  return (
    <div className={styles.strategies}>
      {tradePools?.map(
        ({
          poolPubkey,
          poolImage,
          poolName,
          depositYield,
          collections,
          totalLiquidity,
        }) => (
          <Fragment key={poolPubkey}>
            <Strategy
              poolName={poolName}
              poolImage={poolImage}
              depositYield={depositYield}
              collections={collections}
              totalLiquidity={totalLiquidity}
            />
          </Fragment>
        ),
      )}
    </div>
  );
};

export default Strategies;
