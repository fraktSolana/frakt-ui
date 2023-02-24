import { FC } from 'react';
import classNames from 'classnames';
import { collectionPreview } from './assets/constants';

import styles from './CollectionsPreviews.module.scss';

const CollectionsPreviews: FC<any> = ({ collections }) => {
  const collectionsLimit = 4;
  const showLabelCollectionsAmount = collections.length - collectionsLimit > 0;

  return (
    <div
      className={classNames(styles.collections, {
        [styles.labelCollectionsAmount]: showLabelCollectionsAmount,
      })}
      data-collections-amount={`+${collections.length - collectionsLimit}`}
    >
      {collections.slice(0, collectionsLimit).map(({ name, image }) => (
        <img key={name} className={styles.preview} src={image} alt="" />
      ))}
    </div>
  );
};

export default CollectionsPreviews;
