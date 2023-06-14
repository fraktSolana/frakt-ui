import { FC } from 'react';

import { StatInfo, VALUES_TYPES } from '@frakt/components/StatInfo';

import styles from './GeneralCollectionInfo.module.scss';
import { colorByPercentHealth, getColorByPercent } from '@frakt/utils/bonds';

interface GeneralCollectionInfoProps {
  collectionImage: string;
  collectionName: string;
  bestOffer: number;
  bestLTV: number;
  collectionFloor: number;
}

export const GeneralCollectionInfo: FC<GeneralCollectionInfoProps> = ({
  collectionFloor,
  collectionImage,
  collectionName,
  bestOffer,
  bestLTV,
}) => {
  const statsData = [
    { label: 'Floor', value: collectionFloor, divider: 1e9 },
    {
      label: 'Best',
      value: bestOffer,
      divider: 1e9,
      tooltipText: 'Current biggest offer for a loan',
    },
    {
      label: 'Ltv',
      value: bestLTV?.toFixed(0),
      valueType: VALUES_TYPES.percent,
      tooltipText: '% of the floor price',
      valueStyles: {
        color:
          getColorByPercent(bestLTV, colorByPercentHealth) ||
          colorByPercentHealth[100],
      },
    },
  ];

  return (
    <div className={styles.collectionInfos}>
      <img src={collectionImage} className={styles.collectionImage} />
      <div className={styles.collectionContent}>
        <h4 className={styles.collectionName}>{collectionName}</h4>
        <div className={styles.collectionStats}>
          {statsData.map((stat) => (
            <StatInfo key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
};
