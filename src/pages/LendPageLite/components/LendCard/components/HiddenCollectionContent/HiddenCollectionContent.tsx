import HistoryTab from '@frakt/pages/MarketsPage/components/BondsOverview/components/HistoryTab/HistoryTab';
import BondsTab from '@frakt/pages/MarketsPage/components/BondsOverview/components/BondsTab';
import { Loader } from '@frakt/components/Loader';
import { Tabs } from '@frakt/components/Tabs';

import { useHiddenCollectionContent } from './hooks';
import OrderBookLite from '../OrderBookLite';
import PlaceOfferTab from '../PlaceOfferTab';

import styles from './HiddenCollectionContent.module.scss';

enum CollectionTabsNames {
  OFFER = 'offer',
  HISTORY = 'history',
  MY_LOANS = 'myLoans',
}

const HiddenCollectionContent = ({
  marketPubkey,
  visibleOrderBook,
}: {
  marketPubkey: string;
  visibleOrderBook: boolean;
}) => {
  const { marketParams, tabsParams, syntheticParams, isLoading } =
    useHiddenCollectionContent(marketPubkey);

  const tabsComponents = {
    [CollectionTabsNames.OFFER]: <PlaceOfferTab {...marketParams} />,
    [CollectionTabsNames.HISTORY]: (
      <HistoryTab
        tableParams={{ classNames: styles.historyTable, scrollX: 650 }}
        containerClassName={styles.tableContainer}
        marketPubkey={marketPubkey}
        isFixedTable
      />
    ),
    [CollectionTabsNames.MY_LOANS]: (
      <BondsTab
        tableParams={{ classNames: styles.bondsTable, scrollX: 650 }}
        containerClassName={styles.tableContainer}
        marketPubkey={marketPubkey}
        showWidgets={false}
      />
    ),
  };

  return (
    <div className={styles.content}>
      {!isLoading && (
        <div>
          <Tabs
            {...tabsParams}
            className={styles.tabs}
            additionalClassNames={{ tabActiveClassName: styles.activeTab }}
          />

          <div className={styles.tabContent}>
            {tabsComponents[tabsParams.value]}
          </div>
        </div>
      )}

      {isLoading && <Loader />}

      {visibleOrderBook && (
        <OrderBookLite {...marketParams} syntheticParams={syntheticParams} />
      )}
    </div>
  );
};

export default HiddenCollectionContent;
