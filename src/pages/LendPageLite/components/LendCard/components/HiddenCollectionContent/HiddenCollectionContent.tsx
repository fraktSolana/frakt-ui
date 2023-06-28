import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import HistoryTab from '@frakt/pages/MarketsPage/components/BondsOverview/components/HistoryTab/HistoryTab';
import BondsTab from '@frakt/pages/MarketsPage/components/BondsOverview/components/BondsTab';
import { SyntheticParams } from '@frakt/pages/MarketsPage/components/OrderBook/types';
import { Tabs, useTabs } from '@frakt/components/Tabs';

import PlaceOfferTab from '../PlaceOfferTab';
import { BONDS_TABS } from './constants';
import OrderBook from '../OrderBook';

import styles from './HiddenCollectionContent.module.scss';

enum CollectionTabsNames {
  OFFER = 'offer',
  HISTORY = 'history',
  MY_LOANS = 'myLoans',
}

const HiddenCollectionContent = () => {
  const { marketPubkey, pairPubkey } = useParams<{
    marketPubkey: string;
    pairPubkey: string;
  }>();

  const {
    tabs: bondTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: BONDS_TABS,
    defaultValue: BONDS_TABS[0].value,
  });

  useEffect(() => {
    if (pairPubkey) {
      setTabValue(BONDS_TABS.at(-1).value);
    }
  }, [pairPubkey]);

  const [syntheticParams, setSyntheticParams] = useState<SyntheticParams>(null);

  const tabsComponents = {
    [CollectionTabsNames.OFFER]: (
      <PlaceOfferTab setSyntheticParams={setSyntheticParams} />
    ),
    [CollectionTabsNames.HISTORY]: (
      <HistoryTab
        tableParams={{ classNames: styles.historyTable, scrollX: 650 }}
        containerClassName={styles.tableContainer}
        isFixedTable
      />
    ),
    [CollectionTabsNames.MY_LOANS]: (
      <BondsTab
        tableParams={{ classNames: styles.bondsTable, scrollX: 650 }}
        containerClassName={styles.tableContainer}
        showWidgets={false}
      />
    ),
  };

  return (
    <div className={styles.content}>
      <div>
        <Tabs
          className={styles.tabs}
          tabs={bondTabs}
          value={tabValue}
          setValue={setTabValue}
          additionalClassNames={{ tabActiveClassName: styles.activeTab }}
        />
        <div className={styles.tabContent}>{tabsComponents[tabValue]}</div>
      </div>
      <OrderBook
        syntheticParams={syntheticParams}
        marketPubkey={marketPubkey}
      />
    </div>
  );
};

export default HiddenCollectionContent;
