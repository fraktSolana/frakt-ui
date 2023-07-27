import { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import classNames from 'classnames';

import { useHoverObserver, useWindowSize } from '@frakt/hooks';
import { Button } from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';

import Chart, { useChartVisible } from './components/Chart';
import { MarketTable } from './components/MarketTable';
import { useMarketsPreview } from '../../hooks';

import styles from './CollectionsOverview.module.scss';

const SMALL_DESKTOP_SIZE = 1300;

const CollectionsOverview: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const { marketsPreview, isLoading } = useMarketsPreview();
  const { width } = useWindowSize();
  const history = useHistory();

  const { isVisible } = useChartVisible();

  const isHovered = useHoverObserver('.ant-table-cell-row-hover');

  const expandActiveCollection = () => history.push(PATHS.BONDS);

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollContainer}>
        <div className={styles.headerWrapper}>
          {marketPubkey && !isLoading && (
            <Button
              onClick={expandActiveCollection}
              className={styles.expandButton}
            >
              Expand
            </Button>
          )}
        </div>

        <MarketTable
          className={classNames(styles.marketTable, {
            [styles.collapsedMarketTable]: marketPubkey,
            [styles.chartMarketTable]: isVisible && marketPubkey,
            [styles.hoveredTableRow]: isHovered,
          })}
          loading={isLoading}
          data={marketsPreview}
          breakpoints={{ scrollX: width < SMALL_DESKTOP_SIZE && 744 }}
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
