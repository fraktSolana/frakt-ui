import { FC } from 'react';

import Heading from '../../Heading';
import styles from './ConnectedLend.module.scss';
import { ChartPie } from '../../ChartPie';

const ConnectedLend: FC = () => {
  const loansInfo = [
    { name: 'Flip', key: 'flip', value: 10 },
    {
      name: 'Perpetual',
      key: 'perpetual',
      value: 20,
    },
    { name: 'Bond', key: 'bond', value: 30 },
    { name: 'On grace', key: 'grace', value: 40 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.searchableList}>
        <Heading title="Lend" tooltipText="Lend" />
        <ChartPie
          data={loansInfo}
          label="Offers and bonds"
          value={500}
          className={styles.chart}
        />
      </div>
      <div className={styles.content}></div>
    </div>
  );
};

export default ConnectedLend;
