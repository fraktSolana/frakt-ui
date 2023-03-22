import { FC, useState, MouseEvent, TouchEvent } from 'react';
import classNames from 'classnames';

import { MarketPreview } from '@frakt/api/bonds';
import { Star, StarActive } from '@frakt/icons';

import { getStorageItemsByKey, setItemsToStorageByKey } from '../helpers';
import styles from './TableCells.module.scss';

type Event = MouseEvent | TouchEvent;

export const TitleCell: FC<{ market: MarketPreview }> = ({ market }) => {
  const storageMarketPubkeys = getStorageItemsByKey('favourites');
  const isFavourited = storageMarketPubkeys.includes(market.marketPubkey);

  const [isAddedToFavoriteList, setIsAddedToFavoriteList] =
    useState<boolean>(isFavourited);

  const addMarketToFavoriteList = (event: Event) => {
    if (isFavourited) return;
    setIsAddedToFavoriteList(true);

    const storageMarketPubkeys = getStorageItemsByKey('favourites');
    const newMarketPubkeys = [...storageMarketPubkeys, market.marketPubkey];

    setItemsToStorageByKey('favourites', newMarketPubkeys);
    event.stopPropagation();
  };

  const removeMarketFromFavoriteList = (event: Event) => {
    setIsAddedToFavoriteList(false);

    const storageMarketPubkeys = getStorageItemsByKey('favourites');
    const newMarketPubkeys = storageMarketPubkeys.filter(
      (savedMarketPubkey: string) => savedMarketPubkey !== market?.marketPubkey,
    );

    setItemsToStorageByKey('favourites', newMarketPubkeys);
    event.stopPropagation();
  };

  return (
    <div className={classNames(styles.row, styles.rowLeft)}>
      <div className={styles.iconWrapper}>
        {isAddedToFavoriteList ? (
          <div onClick={(event: Event) => removeMarketFromFavoriteList(event)}>
            <StarActive className={styles.starIcon} />
          </div>
        ) : (
          <div onClick={(event: Event) => addMarketToFavoriteList(event)}>
            <Star className={styles.starIcon} />
          </div>
        )}
      </div>
      <img src={market.collectionImage} className={styles.nftImage} />
      <div className={styles.nftName}>{market.collectionName}</div>
    </div>
  );
};
