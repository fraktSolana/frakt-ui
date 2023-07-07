import { StatInfo, VALUES_TYPES } from '@frakt/components/StatInfo';

import styles from './RootHeader.module.scss';

const RootHeader = ({ totalAuctions = 0 }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <h3 className={styles.title}>Auctions</h3>
      </div>
      <StatInfo
        flexType="row"
        label="Ongoing:"
        value={totalAuctions}
        valueType={VALUES_TYPES.string}
      />
    </div>
  );
};

export default RootHeader;
