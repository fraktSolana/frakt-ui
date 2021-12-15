import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';
import SwapForm from '../../components/SwapForm';
import { Loader } from '../../components/Loader';
import { useSwapContext } from '../../contexts/Swap';
import { WSOL } from '@raydium-io/raydium-sdk';
import { useFraktion } from '../../contexts/fraktion';

const SwapPage = (): JSX.Element => {
  const { loading: swapLoading } = useSwapContext();
  const { loading: vaultsLoading } = useFraktion();

  const loading = swapLoading || vaultsLoading;

  return (
    <AppLayout contentClassName={styles.exchange}>
      <div className={styles.container}>
        <h1 className={styles.title}>Swap</h1>
        <div className={styles.description}>
          Swap fraktions with your crypto assets{' '}
        </div>
        {loading ? (
          <div className={styles.loader}>
            <Loader size={'large'} />
          </div>
        ) : (
          <SwapForm defaultTokenMint={WSOL.mint} />
        )}
      </div>
    </AppLayout>
  );
};

export default SwapPage;