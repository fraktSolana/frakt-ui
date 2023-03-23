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
      <StatsValues
        label="Offer TVL"
        value={
          <>
            {marketPreview?.offerTVL} <Solana />
          </>
        }
        tooltipText="Total liquidity currently available in active offers"
      />
      <StatsValues
        label="APR"
        value={
          <p className={styles.highlightPositiveText}>
            up to {marketPreview?.apy.toFixed(2)} %
          </p>
        }
        tooltipText="Interest (in %) for the duration of this loan"
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
