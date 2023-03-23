import { MarketPreview } from '@frakt/api/bonds';
import { map, sum } from 'lodash';

export const getStorageItemsByKey = (key: string) => {
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const setItemsToStorageByKey = (key: string, items: any) => {
  localStorage.setItem(key, JSON.stringify(items));
};

export const formateDuration = (value: number[]) => sum(map(value));

export const formateToNumbers = (value: string) => parseFloat(value);

const storageMarketPubkeys = getStorageItemsByKey('favourites');

export const sortingFavoriteList = (
  a: MarketPreview,
  b: MarketPreview,
  sortBy: string,
  formateFunction?: (value: any) => any,
) => {
  const valueExistInStorageA = storageMarketPubkeys.includes(a.marketPubkey);
  const valueExistInStorageB = storageMarketPubkeys.includes(b.marketPubkey);

  if (valueExistInStorageA && valueExistInStorageB)
    return formateFunction
      ? formateFunction(a[sortBy]) - formateFunction(b[sortBy])
      : a[sortBy] - b[sortBy];

  if (valueExistInStorageB) return -1;
  else if (valueExistInStorageA) return 1;

  return formateFunction
    ? formateFunction(a[sortBy]) - formateFunction(b[sortBy])
    : a[sortBy] - b[sortBy];
};
