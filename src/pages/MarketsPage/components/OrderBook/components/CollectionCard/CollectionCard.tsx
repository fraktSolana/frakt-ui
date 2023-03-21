import { FC, useState } from 'react';
import classNames from 'classnames';

import { useMarketPairs } from '@frakt/utils/bonds';
import Button from '@frakt/components/Button';
import { ChevronDown } from '@frakt/icons';

import {
  isOwnOrder,
  makeEditOrderPath,
  parseMarketOrder,
  sortOffersByInterest,
  sortOffersByLtv,
} from '../../helpers';
import Offer from '../Offer';

import styles from './CollectionCard.module.scss';

interface CollectionCardProps {
  collectionName: string;
  collectionImage: string;
  marketPubkey: string;
}

const CollectionCard: FC<CollectionCardProps> = ({
  collectionName,
  collectionImage,
  marketPubkey,
}) => {
  const [isVisibleOfferList, setIsVisibleOfferList] = useState(false);
  const { pairs, isLoading: isLoadingPairs } = useMarketPairs({
    marketPubkey: isVisibleOfferList ? marketPubkey : '',
  });

  const parsedOffers = pairs.map(parseMarketOrder);
  const sortedOffersByInterest = sortOffersByInterest(parsedOffers);
  const sortedByLtv = sortOffersByLtv(sortedOffersByInterest);

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
        {parsedOffers.map((offer, idx) => (
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
      </div>
    </>
  );
};

export default CollectionCard;
