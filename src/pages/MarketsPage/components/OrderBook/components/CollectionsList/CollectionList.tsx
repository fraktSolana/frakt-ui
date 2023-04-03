import { FC } from 'react';
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
  const { marketsPreview, isLoading } = useMarketsPreview({ showOwnOrders });

  if (isLoading) return <Loader />;

  return (
    <ul
      className={classNames(styles.list, {
        [styles.create]: existSyntheticParams,
        [styles.active]: openOffersMobile,
      })}
    >
      {marketsPreview.map((market) => (
        <CollectionCard
          {...market}
          key={market.marketPubkey}
          openOffersMobile={openOffersMobile}
          existSyntheticParams={existSyntheticParams}
          showOwnOrders={showOwnOrders}
          duration={duration}
        />
      ))}
    </ul>
  );
};

export default CollectionList;
