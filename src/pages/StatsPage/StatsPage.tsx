import { FC } from 'react';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Container } from '../../components/Layout';
import SystemHealth from './components/SystemHealth';
import DailyActive from './components/DailyActive';
import TotalStats from './components/TotalStats';
import styles from './StatsPage.module.scss';
import Lending from './components/Lending';
import Pools from './components/Pools';

const poolsInfo = [
  { name: 'Solpunks', value: '132' },
  { name: 'Frakt', value: '100' },
  { name: 'Turtles', value: '132' },
  { name: 'Other Collecions', value: '400' },
];

const StatsPage: FC = () => {
  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <h1 className={styles.title}>Stats</h1>
        <h2 className={styles.subtitle}>Keep track on protocol’s success</h2>
        <div className={styles.totalStats}>
          <TotalStats
            lockedNftsInPools={287}
            poolsTvl={477.8426}
            poolsVolumeAllTime={1957.4905}
            totalIssuedInLoans={125}
            loansTvl={132.102}
            loansVolumeAllTime={53.9037}
          />
          <DailyActive
            lockedNftsInLoans={1245}
            issuedIn24Hours={526}
            paidBackIn24Hours={131}
            liquidatedIn24Hours={156}
          />
        </div>
        <Lending />
        <div className={styles.poolsWrapper}>
          <Pools poolsInfo={poolsInfo} />
          <SystemHealth health={80} />
        </div>
      </Container>
    </AppLayout>
  );
};

export default StatsPage;
