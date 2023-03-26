import { FC } from 'react';
import classNames from 'classnames';

import { Loader } from '@frakt/components/Loader';
import Button from '@frakt/components/Button';
import { ChevronDown } from '@frakt/icons';

import { isOwnOrder, makeEditOrderPath } from '../../helpers';
import { useCollectionCard } from './hooks';
import Offer from '../Offer';
import Sort from '../Sort';

import styles from './CollectionCard.module.scss';

interface CollectionCardProps {
  collectionName: string;
  collectionImage: string;
  marketPubkey: string;
  openOffersMobile: boolean;
  existSyntheticParams: boolean;
  showOwnOrders: boolean;
}

const CollectionCard: FC<CollectionCardProps> = ({
  collectionName,
  collectionImage,
  marketPubkey,
  openOffersMobile,
  existSyntheticParams,
  showOwnOrders,
}) => {
  const {
    offers,
    loading,
    toggleSortDirection,
    isVisibleOfferList,
    setIsVisibleOfferList,
    sortDirection,
  } = useCollectionCard({
    showOwnOrders,
    marketPubkey,
  });

  return (
    <>
      <div
        className={styles.collectionCard}
        onClick={() => setIsVisibleOfferList(!isVisibleOfferList)}
      >
        <div className={styles.collectionInfo}>
          <img className={styles.collectionImage} src={collectionImage} />
          <p className={styles.collectionName}>{collectionName}</p>
        </div>
        <Button
          className={classNames(styles.button, {
            [styles.active]: offers.length,
          })}
          type="tertiary"
        >
          <ChevronDown />
        </Button>
      </div>
      <div className={styles.hiddenOffersList}>
        {loading && isVisibleOfferList && <Loader />}
        {!!offers.length && (
          <Sort
            onChangeSort={toggleSortDirection}
            existSyntheticParams={existSyntheticParams}
            openOffersMobile={openOffersMobile}
            sort={sortDirection}
          />
        )}
        {offers.map((offer, idx) => (
          <Offer
            ltv={offer.ltv}
            size={offer.size}
            interest={offer.interest}
            order={offer}
            bestOffer={offers.at(0)}
            duration={offer.duration}
            editOrder={() => makeEditOrderPath(offer, marketPubkey)}
            isOwnOrder={isOwnOrder(offer)}
            key={idx}
          />
        ))}
        {!loading && !offers.length && isVisibleOfferList && <EmptyCard />}
      </div>
    </>
  );
};

export default CollectionCard;

const EmptyCard = () => (
  <div className={styles.emptyCard}>
    <h4 className={styles.emptyCardTitle}>No active offers at the moment</h4>
    <p className={styles.emptyCardSubtitle}>Good chance to be first!</p>
  </div>
);
