import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { useMarket } from '@frakt/utils/bonds';

import CollectionsOverview from './components/CollectionsOverview';
import OrderBook from './components/OrderBook/OrderBook';
import BondsOverview from './components/BondsOverview';

import styles from './MarketsPage.module.scss';

const MarketsPreviewPage: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const { market, isLoading: marketLoading } = useMarket({ marketPubkey });

  return (
    <AppLayout>
      <div className={styles.container}>
        <CollectionsOverview />
        <BondsOverview />
        <OrderBook market={market} marketLoading={marketLoading} />
      </div>
    </AppLayout>
  );
};

export default MarketsPreviewPage;
