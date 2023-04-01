import { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import classNames from 'classnames';

import { useWindowSize } from '@frakt/hooks';

import Chart, { useChartVisible } from './components/Chart';
import { MarketTable } from './components/MarketTable';
import { useMarketsPreview } from '../../hooks';

import styles from './CollectionsOverview.module.scss';
import { PATHS } from '@frakt/constants';

const MOBILE_VIEW_SIZE = 1300;

const CollectionsOverview: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const { marketsPreview, isLoading } = useMarketsPreview();
  const { width } = useWindowSize();
  const history = useHistory();

  const { isVisible } = useChartVisible();

  const unselectActiveCollection = () => history.push(PATHS.BONDS);

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollContainer}>
        <div className={styles.headerWrapper}>
          <h3 className={styles.title}>Collections</h3>
          {marketPubkey && (
            <a onClick={unselectActiveCollection} className={styles.showMore}>
              See all
            </a>
          )}
        </div>

        <MarketTable
          className={classNames(styles.marketTable, {
            [styles.collapsedMarketTable]: marketPubkey,
            [styles.chartMarketTable]: isVisible && marketPubkey,
          })}
          loading={isLoading}
          data={marketsPreview}
          breakpoints={{
            scrollX: width < MOBILE_VIEW_SIZE && 744,
            scrollY: 236,
          }}
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
