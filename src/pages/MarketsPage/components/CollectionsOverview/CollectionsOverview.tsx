import { FC } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import { useMarketsPreview } from '../BondsOverview/hooks';
import { MarketTable } from './components/MarketTable';
import Chart from './components/Chart';

import styles from './CollectionsOverview.module.scss';

const CollectionsOverview: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const { marketsPreview, isLoading } = useMarketsPreview();

  return (
    <div className={styles.wrapper}>
      <div>
        <h3 className={styles.title}>Collections</h3>
        <MarketTable
          className={classNames(styles.rootTable, styles.marketTable, {
            [styles.collapsedMarketTable]: marketPubkey,
          })}
          loading={isLoading}
          data={marketsPreview}
          breakpoints={{ mobile: 768, scrollY: 216 }}
          marketPubkey={marketPubkey}
        />
      </div>
      {marketPubkey && (
        <Chart
          isLoading={isLoading}
          marketPreview={marketsPreview.find(
            (market) => market?.marketPubkey === marketPubkey,
          )}
        />
      )}
    </div>
  );
};

export default CollectionsOverview;
