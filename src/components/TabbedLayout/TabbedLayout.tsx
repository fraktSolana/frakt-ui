import { PropsWithChildren } from 'react';
import classnames from 'classnames';

import { Tabs, TabsProps } from '../Tabs';

import styles from './TabbedLayout.module.scss';

const TabbedLayout = (
  props: PropsWithChildren<TabsProps> & {
    contentClassName?: string;
    tabClassName?: string;
  },
) => {
  const { children, contentClassName, tabClassName, ...restProps } = props;

  const containerClasses = classnames(styles.container, contentClassName);
  const tabClasses = classnames(styles.tab, tabClassName);

  return (
    <div className={containerClasses}>
      <Tabs className={tabClasses} {...restProps} />
      <div className={styles.tabContent}>{children}</div>
    </div>
  );
};

export default TabbedLayout;
