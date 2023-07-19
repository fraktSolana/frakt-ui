import { countBy, map, find } from 'lodash';
import { BorrowNft } from '@frakt/api/nft';

export const getUniqCollectionsWithCountNFTs = (nfts: BorrowNft[]) => {
  const countByCollectionName = countBy(nfts, 'collectionName');

  return map(countByCollectionName, (nftsCount, collectionName) => {
    //TODO: Need get collectionImageUrl, when will be added
    const collectionImage =
      find(nfts, { collectionName })?.collectionImage || '';

    return { collectionName, nftsCount, collectionImage };
  });
};
