import { FC } from 'react';
import classNames from 'classnames';

import Button, { NavigationButton } from '@frakt/components/Button';
import { Loader } from '@frakt/components/Loader';
import { PATHS } from '@frakt/constants';
import { ChevronDown } from '@frakt/icons';

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
  duration: number;
}

const CollectionCard: FC<CollectionCardProps> = ({
  collectionName,
  collectionImage,
  marketPubkey,
  openOffersMobile,
  existSyntheticParams,
  showOwnOrders,
  duration,
}) => {
  const {
    offers,
    loading,
    toggleSortDirection,
    isVisibleOfferList,
    setIsVisibleOfferList,
    sortDirection,
    goToEditOffer,
    isOwnOrder,
    bestOffer,
  } = useCollectionCard({
    showOwnOrders,
    marketPubkey,
    duration,
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
            [styles.active]: isVisibleOfferList,
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
            bestOffer={bestOffer}
            duration={offer.duration}
            editOrder={() => goToEditOffer(offer?.rawData?.publicKey)}
            isOwnOrder={isOwnOrder(offer)}
            key={idx}
          />
        ))}
        {!loading && !offers.length && isVisibleOfferList && (
          <EmptyCard marketPubkey={marketPubkey} />
        )}
      </div>
    </>
  );
};

export default CollectionCard;

const EmptyCard = ({ marketPubkey }: { marketPubkey: string }) => (
  <div className={styles.emptyCard}>
    <h4 className={styles.emptyCardTitle}>No active offers at the moment</h4>
    <p className={styles.emptyCardSubtitle}>Good chance to be first!</p>
    <NavigationButton
      path={`${PATHS.OFFER}/${marketPubkey}`}
      className={styles.emptyCardButton}
    >
      Place offers
    </NavigationButton>
  </div>
);
