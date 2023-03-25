import { FC } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import { useMarketsPreview } from '../BondsOverview/hooks';
import { MarketTable } from './components/MarketTable';
import Chart, { useBondChart } from './components/Chart';

import styles from './CollectionsOverview.module.scss';
import { useWindowSize } from '@frakt/hooks';

const MOBILE_VIEW_SIZE = 1300;

const CollectionsOverview: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const { marketsPreview, isLoading } = useMarketsPreview();
  const { width } = useWindowSize();

  const { isVisible } = useBondChart();

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
