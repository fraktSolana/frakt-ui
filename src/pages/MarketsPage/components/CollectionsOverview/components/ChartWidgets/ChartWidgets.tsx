import { FC, ReactNode } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { colorByPercentOffers, getColorByPercent } from '@frakt/utils/bonds';
import { MarketPreview } from '@frakt/api/bonds';
import Tooltip from '@frakt/components/Tooltip';

import { formateMarketPreviewValues } from './helpers';

import styles from './ChartWidgets.module.scss';

interface ChartWidgetsProps {
  marketPreview: MarketPreview;
}

const ChartWidgets: FC<ChartWidgetsProps> = ({ marketPreview }) => {
  const { bestOffer, duration, apr, bestLTV, offerTVL } =
    formateMarketPreviewValues(marketPreview);

  return (
    <div className={styles.wrapper}>
      <CollectionGeneralInfo
        image={marketPreview?.collectionImage}
        name={marketPreview?.collectionName}
      />
      <div className={styles.stats}>
        <StatsValues
          label="Best offer"
          value={
            <div className={styles.rowCenter}>
              <span className={styles.value}>{bestOffer}◎</span>
              <span
                style={{
                  color: getColorByPercent(
                    marketPreview?.bestLTV,
                    colorByPercentOffers,
                  ),
                }}
                className={styles.value}
              >
                LTV {bestLTV?.toFixed(0)} %
              </span>
            </div>
          }
          tooltipText="Total liquidity currently available in active offers"
        />
        <StatsValues
          label="APR"
          value={<p className={styles.highlightPositiveText}>up to {apr} %</p>}
          tooltipText="Interest (in %) for the duration of this loan"
        />
        <StatsValues
          label="Offer TVL"
          value={<>{offerTVL}◎</>}
          tooltipText="Total liquidity currently available in active offers"
        />
        <StatsValues label="Duration" value={duration} />
      </div>
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
  <div className={styles.values}>
    <div className={styles.rowCenter}>
      <span className={styles.label}>{label}</span>
      {tooltipText && <Tooltip placement="bottom" overlay={tooltipText} />}
    </div>
    <span className={styles.value}>{value}</span>
  </div>
);
