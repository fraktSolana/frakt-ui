import { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { useMarket } from '@frakt/utils/bonds';
import { PATHS } from '@frakt/constants';

import { LendMode, RootHeader } from '../LendPageLite/components/RootHeader';
import CollectionsOverview from './components/CollectionsOverview';
import OrderBook from './components/OrderBook/OrderBook';
import BondsOverview from './components/BondsOverview';

import styles from './MarketsPage.module.scss';

const MarketsPreviewPage: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const { market, isLoading: marketLoading } = useMarket({ marketPubkey });
  const history = useHistory();

  const goToLiteLending = () => history.push(PATHS.BONDS_LITE);

  return (
    <AppLayout>
      <div className={styles.container}>
        <RootHeader mode={LendMode.PRO} onModeSwitch={goToLiteLending} />
        <CollectionsOverview />
        <BondsOverview />
        <OrderBook market={market} marketLoading={marketLoading} />
      </div>
    </AppLayout>
  );
};

export default MarketsPreviewPage;
