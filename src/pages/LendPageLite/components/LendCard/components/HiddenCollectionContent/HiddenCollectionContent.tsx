import { useEffect, useState } from 'react';

import HistoryTab from '@frakt/pages/MarketsPage/components/BondsOverview/components/HistoryTab/HistoryTab';
import BondsTab from '@frakt/pages/MarketsPage/components/BondsOverview/components/BondsTab';
import { Tabs, useTabs } from '@frakt/components/Tabs';

import OrderBookLite, { SyntheticParams } from '../OrderBookLite';
import PlaceOfferTab from '../PlaceOfferTab';
import { BONDS_TABS } from './constants';

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
  const [pairPubkey, setPairPubkey] = useState<string>('');
  const [syntheticParams, setSyntheticParams] = useState<SyntheticParams>(null);

  const marketData = {
    pairPubkey,
    marketPubkey,
    setSyntheticParams,
    setPairPubkey,
  };

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

  const tabsComponents = {
    [CollectionTabsNames.OFFER]: <PlaceOfferTab {...marketData} />,
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
      {visibleOrderBook && (
        <OrderBookLite {...marketData} syntheticParams={syntheticParams} />
      )}
    </div>
  );
};

export default HiddenCollectionContent;
