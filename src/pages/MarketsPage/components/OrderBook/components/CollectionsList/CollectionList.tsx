import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { useMarketsPreview } from '@frakt/pages/MarketsPage/hooks';
import { Loader } from '@frakt/components/Loader';

import CollectionCard from '../CollectionCard';

import styles from './CollectionList.module.scss';

interface CollectionListProps {
  openOffersMobile: boolean;
  existSyntheticParams: boolean;
  showOwnOrders: boolean;
  duration: number;
}

const CollectionList: FC<CollectionListProps> = ({
  openOffersMobile,
  existSyntheticParams,
  showOwnOrders,
  duration,
}) => {
  const { publicKey } = useWallet();
  const { marketsPreview, isLoading } = useMarketsPreview(
    showOwnOrders && publicKey,
  );

  if (isLoading) return <Loader />;

  return (
    <ul
      className={classNames(styles.list, {
        [styles.active]: openOffersMobile,
      })}
    >
      {marketsPreview.length ? (
        marketsPreview.map((market) => (
          <CollectionCard
            {...market}
            key={market.marketPubkey}
            openOffersMobile={openOffersMobile}
            existSyntheticParams={existSyntheticParams}
            showOwnOrders={showOwnOrders}
            duration={duration}
          />
        ))
      ) : (
        <EmptyList />
      )}
    </ul>
  );
};

export default CollectionList;

const EmptyList = () => (
  <div className={styles.emptyList}>
    <h4 className={styles.emptyListTitle}>No active offers at the moment</h4>
    <p className={styles.empryListText}>
      Please select collection to place your offers
    </p>
  </div>
);
