import { FC, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import classNames from 'classnames';

import { useWindowSize } from '@frakt/hooks';

import Chart, { useChartVisible } from './components/Chart';
import { MarketTable } from './components/MarketTable';
import { useMarketsPreview } from '../../hooks';

import styles from './CollectionsOverview.module.scss';
import { PATHS } from '@frakt/constants';
import { Button } from '@frakt/components/Button';

const SMALL_DESKTOP_SIZE = 1300;

const CollectionsOverview: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const { marketsPreview, isLoading } = useMarketsPreview();
  const { width } = useWindowSize();
  const history = useHistory();

  const { isVisible } = useChartVisible();

  const expandActiveCollection = () => history.push(PATHS.BONDS);

  const sortedMarketsByLoansTVL = useMemo(() => {
    const sortedMarkets = [...marketsPreview].sort(
      (marketA, marketB) => marketB.loansTVL - marketA.loansTVL,
    );
    return sortedMarkets;
  }, [marketsPreview]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollContainer}>
        <div className={styles.headerWrapper}>
          <h3 className={styles.title}>Collections</h3>
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
          })}
          loading={isLoading}
          data={sortedMarketsByLoansTVL}
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
