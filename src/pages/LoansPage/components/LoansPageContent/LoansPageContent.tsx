import { FC } from 'react';

import { Tabs, useTabs } from '@frakt/components/Tabs';

import { LOANS_TABS, LoansTabsNames } from '../../constants';
import LoansActiveTab from '../LoansActiveTab/LoansActiveTab';
import LoansHistoryTab from '../LoansHistoryTab';

import styles from './LoansPageContent.module.scss';

export const LoansPageContent: FC = () => {
  const {
    tabs: marketTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({ tabs: LOANS_TABS, defaultValue: LOANS_TABS[0].value });

  return (
    <div className={styles.content}>
      <Tabs
        className={styles.tabs}
        tabs={marketTabs}
        value={tabValue}
        setValue={setTabValue}
        additionalClassNames={{ tabActiveClassName: styles.activeTab }}
      />
      <div className={styles.tabContent}>
        {tabValue === LoansTabsNames.ACTIVE && <LoansActiveTab />}
        {tabValue === LoansTabsNames.HISTORY && <LoansHistoryTab />}
      </div>
    </div>
  );
};
