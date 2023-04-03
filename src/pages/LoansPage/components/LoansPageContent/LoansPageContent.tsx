import { FC } from 'react';

import { Tabs, useTabs } from '@frakt/components/Tabs';
import { Loan } from '@frakt/api/loans';

import { LOANS_TABS, LoansTabsNames } from '../../constants';
import LoansActiveTab from '../LoansActiveTab/LoansActiveTab';

import styles from './LoansPageContent.module.scss';

interface LoansPageContentProps {
  loans: Loan[];
  isLoading: boolean;
}

export const LoansPageContent: FC<LoansPageContentProps> = ({
  loans,
  isLoading,
}) => {
  const {
    tabs: marketTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({ tabs: LOANS_TABS, defaultValue: LOANS_TABS[0].value });

  return (
    <div className={styles.content}>
      <Tabs
        className={styles.tab}
        tabs={marketTabs}
        value={tabValue}
        setValue={setTabValue}
      />
      <div className={styles.tabContent}>
        {tabValue === LoansTabsNames.ACTIVE && (
          <LoansActiveTab loans={loans} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};
