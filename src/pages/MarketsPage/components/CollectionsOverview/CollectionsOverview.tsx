import { FC } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import { useWindowSize } from '@frakt/hooks';

import Chart, { useChartVisible } from './components/Chart';
import { MarketTable } from './components/MarketTable';
import { useMarketsPreview } from '../../hooks';

import styles from './CollectionsOverview.module.scss';

const MOBILE_VIEW_SIZE = 1300;

const CollectionsOverview: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const { marketsPreview, isLoading } = useMarketsPreview();
  const { width } = useWindowSize();

  const { isVisible } = useChartVisible();

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollContainer}>
        <h3 className={styles.title}>Collections</h3>
        <MarketTable
          className={classNames(styles.marketTable, {
            [styles.collapsedMarketTable]: marketPubkey,
            [styles.chartMarketTable]: isVisible && marketPubkey,
          })}
          loading={isLoading}
          data={marketsPreview}
          breakpoints={{ scrollX: width < MOBILE_VIEW_SIZE && 744 }}
          marketPubkey={marketPubkey}
        />
      </div>
      {marketPubkey && (
        <Chart
          isLoading={isLoading}
          marketPreview={marketsPreview.find(
            (market) => market?.marketPubkey === marketPubkey,
          )}
          isVisible={isVisible}
        />
      )}
    </div>
  );
};

export default CollectionsOverview;
