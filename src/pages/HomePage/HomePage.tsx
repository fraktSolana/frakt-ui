import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';

const HomePage = (): JSX.Element => {
  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <h1 className={styles.title}>
          BUY, SELL AND <b>FRAKTIONALIZE</b> NFTs
        </h1>
        <h2 className={styles.subtitle}>Launching soon on Solana</h2>
        <div className={styles.separator} />
      </Container>
    </AppLayout>
  );
};

export default HomePage;
