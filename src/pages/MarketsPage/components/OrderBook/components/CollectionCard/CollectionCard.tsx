import { FC, useState } from 'react';
import classNames from 'classnames';

import { useMarketPairs } from '@frakt/utils/bonds';
import { Loader } from '@frakt/components/Loader';
import Button from '@frakt/components/Button';
import { ChevronDown } from '@frakt/icons';

import { SortOrder } from '../../types';
import Offer from '../Offer';
import Sort from '../Sort';
import {
  isOwnOrder,
  makeEditOrderPath,
  parseMarketOrder,
  sortOffersByInterest,
  sortOffersByLtv,
} from '../../helpers';

import styles from './CollectionCard.module.scss';

interface CollectionCardProps {
  collectionName: string;
  collectionImage: string;
  marketPubkey: string;
  openOffersMobile: boolean;
  existSyntheticParams: boolean;
}

const CollectionCard: FC<CollectionCardProps> = ({
  collectionName,
  collectionImage,
  marketPubkey,
  openOffersMobile,
  existSyntheticParams,
}) => {
  const [isVisibleOfferList, setIsVisibleOfferList] = useState(false);
  const { pairs, isLoading: isLoadingPairs } = useMarketPairs({
    marketPubkey: isVisibleOfferList ? marketPubkey : '',
  });
  const [sort, setSort] = useState<SortOrder>(SortOrder.DESC);

  const parsedOffers = pairs.map(parseMarketOrder, sort);
  const sortedOffersByInterest = sortOffersByInterest(parsedOffers, sort);
  const sortedByLtv = sortOffersByLtv(sortedOffersByInterest, sort);

  const toggleSort = () => {
    sort === SortOrder.DESC ? setSort(SortOrder.ASC) : setSort(SortOrder.DESC);
  };

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
            [styles.active]: parsedOffers.length,
          })}
          type="tertiary"
        >
          <ChevronDown />
        </Button>
      </div>
      <div className={styles.hiddenOffersList}>
        {isLoadingPairs && isVisibleOfferList && <Loader />}
        {!!parsedOffers.length && (
          <Sort
            onChangeSort={toggleSort}
            existSyntheticParams={existSyntheticParams}
            openOffersMobile={openOffersMobile}
            sort={sort}
          />
        )}
        {sortedByLtv.map((offer, idx) => (
          <Offer
            ltv={offer.ltv}
            size={offer.size}
            interest={offer.interest}
            order={offer}
            bestOffer={sortedByLtv.at(0)}
            duration={offer.duration}
            editOrder={() => makeEditOrderPath(offer, marketPubkey)}
            isOwnOrder={isOwnOrder(offer)}
            key={idx}
          />
        ))}
        {!isLoadingPairs && !parsedOffers.length && isVisibleOfferList && (
          <EmptyCard />
        )}
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
