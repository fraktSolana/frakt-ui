import TopLendList from '../TopLendList';
import Heading from '../../Heading';
import { NavigationButton } from '@frakt/components/Button';

import styles from './ContentViews.module.scss';

export const LendListContentView = ({ data, path, title, tooltipText }) => {
  return (
    <div className={styles.wrapper}>
      <Heading title={title} tooltipText={tooltipText} />
      <TopLendList data={data} isLoading={false} />
      <NavigationButton className={styles.navigationButton} path={path}>
        See all
      </NavigationButton>
    </div>
  );
};
