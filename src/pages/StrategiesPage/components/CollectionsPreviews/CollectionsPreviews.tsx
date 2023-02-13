import { FC } from 'react';
import classNames from 'classnames';
import { collectionPreview } from './assets/constants';

import styles from './CollectionsPreviews.module.scss';

const CollectionsPreviews: FC = () => {
  const collectionsLimit = 4;
  const showLabelCollectionsAmount =
    collectionPreview.length - collectionsLimit > 0;

  return (
    <div
      className={classNames(styles.collections, {
        [styles.labelCollectionsAmount]: showLabelCollectionsAmount,
      })}
      data-collections-amount={`+${
        collectionPreview.length - collectionsLimit
      }`}
    >
      {collectionPreview.slice(0, collectionsLimit).map(({ image, name }) => (
        <img key={name} className={styles.preview} src={image} alt={name} />
      ))}
    </div>
  );
};

export default CollectionsPreviews;
