import { FC, ReactNode } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { MarketPreview } from '@frakt/api/bonds';
import Tooltip from '@frakt/components/Tooltip';
import { Solana } from '@frakt/icons';

import styles from './ChartWidgets.module.scss';

interface ChartWidgetsProps {
  marketPreview: MarketPreview;
}

const ChartWidgets: FC<ChartWidgetsProps> = ({ marketPreview }) => {
  return (
    <div className={styles.wrapper}>
      <CollectionGeneralInfo
        image={marketPreview?.collectionImage}
        name={marketPreview?.collectionName}
      />
      <StatsValues
        label="Offer TVL"
        value={
          <>
            {marketPreview?.offerTVL} <Solana />
          </>
        }
        tooltipText="Offer TVL"
      />
      <StatsValues
        label="APR"
        value={
          <p className={styles.highlightPositiveText}>
            up to {marketPreview?.apy.toFixed(2)} %
          </p>
        }
        tooltipText="APR"
      />
      <StatsValues
        label="Duration"
        value={
          marketPreview?.duration?.length
            ? `${marketPreview?.duration?.join(' / ')} days`
            : '--'
        }
      />
    </div>
  );
};

export default ChartWidgets;

const CollectionGeneralInfo = ({
  image,
  name,
}: {
  image: string;
  name: string;
}) => (
  <div className={styles.collectionGeneralInfo}>
    <img className={styles.collectionImage} src={image} />
    <p className={styles.collectionName}>{name}</p>
  </div>
);

const StatsValues = ({
  label,
  value,
  tooltipText,
}: {
  label: string;
  value: ReactNode;
  tooltipText?: string;
}) => (
  <div className={styles.column}>
    <div className={styles.rowCenter}>
      <span className={styles.label}>{label}</span>
      {tooltipText && (
        <Tooltip placement="bottom" overlay={tooltipText}>
          <QuestionCircleOutlined className={styles.questionIcon} />
        </Tooltip>
      )}
    </div>
    <span className={styles.value}>{value}</span>
  </div>
);
