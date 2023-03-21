import { FC } from 'react';
import classNames from 'classnames';

import { useMarketsPreview } from '../../../BondsOverview/hooks';
import CollectionCard from '../CollectionCard';

import styles from './CollectionList.module.scss';

interface CollectionListProps {
  openOffersMobile: boolean;
  existSyntheticParams: boolean;
  sortDirection: string;
}

const CollectionList: FC<CollectionListProps> = ({
  openOffersMobile,
  existSyntheticParams,
  sortDirection = 'desc',
}) => {
  const { marketsPreview, isLoading } = useMarketsPreview();

  if (isLoading) return <>Loading...</>;

  return (
    <ul
      className={classNames(styles.list, {
        [styles.create]: existSyntheticParams,
        [styles.active]: openOffersMobile,
      })}
    >
      {marketsPreview.map((market) => (
        <CollectionCard key={market.marketPubkey} {...market} />
      ))}
    </ul>
  );
};

export default CollectionList;
