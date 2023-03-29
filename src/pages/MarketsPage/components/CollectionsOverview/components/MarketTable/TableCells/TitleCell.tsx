import { FC, useState, MouseEvent, TouchEvent } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import { Chart, Star, StarActive } from '@frakt/icons';
import { MarketPreview } from '@frakt/api/bonds';

import { getStorageItemsByKey, setItemsToStorageByKey } from '../helpers';
import { useChartVisible } from '../../Chart';

import styles from './TableCells.module.scss';

type Event = MouseEvent | TouchEvent;

export const TitleCell: FC<{
  market: MarketPreview;
  onRowClick: (market: MarketPreview) => void;
}> = ({ market, onRowClick }) => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();

  const { toggleVisibility, setVisibility } = useChartVisible();
  const storageMarketPubkeys = getStorageItemsByKey('favourites');
  const isFavourited = storageMarketPubkeys.includes(market.marketPubkey);

  const [addedToFavoriteList, setAddedToFavoriteList] = useState<string[]>([]);

  const addMarketToFavoriteList = (event: Event) => {
    if (isFavourited) return;
    setAddedToFavoriteList([...addedToFavoriteList, market?.marketPubkey]);

    const storageMarketPubkeys = getStorageItemsByKey('favourites');
    const newMarketPubkeys = [...storageMarketPubkeys, market.marketPubkey];

    setItemsToStorageByKey('favourites', newMarketPubkeys);
    event.stopPropagation();
  };

  const removeMarketFromFavoriteList = (event: Event) => {
    setAddedToFavoriteList(
      addedToFavoriteList.filter(
        (marketPubkey: string) => marketPubkey !== market?.marketPubkey,
      ),
    );

    const storageMarketPubkeys = getStorageItemsByKey('favourites');
    const newMarketPubkeys = storageMarketPubkeys.filter(
      (savedMarketPubkey: string) => savedMarketPubkey !== market?.marketPubkey,
    );

    setItemsToStorageByKey('favourites', newMarketPubkeys);
    event.stopPropagation();
  };

  const onChangeChartVisible = (event: Event) => {
    if (marketPubkey !== market?.marketPubkey) {
      onRowClick(market);
      setVisibility(true);
    } else {
      toggleVisibility();
    }
    event.stopPropagation();
  };

  return (
    <div className={classNames(styles.row, styles.rowLeft)}>
      <div className={styles.iconWrapper}>
        {isFavourited || addedToFavoriteList.includes(market?.marketPubkey) ? (
          <div
            className={styles.rowCenter}
            onClick={(event: Event) => removeMarketFromFavoriteList(event)}
          >
            <StarActive className={styles.starIcon} />
          </div>
        ) : (
          <div
            className={styles.rowCenter}
            onClick={(event: Event) => addMarketToFavoriteList(event)}
          >
            <Star className={styles.starIcon} />
          </div>
        )}
      </div>
      <div className={styles.rowCenter}>
        <img src={market.collectionImage} className={styles.nftImage} />
        <div className={styles.nftName}>{market.collectionName}</div>
        <div
          className={styles.chartIcon}
          onClick={(event: Event) => onChangeChartVisible(event)}
        >
          <Chart />
        </div>
      </div>
    </div>
  );
};
