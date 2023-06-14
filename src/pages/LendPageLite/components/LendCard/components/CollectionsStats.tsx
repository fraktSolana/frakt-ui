import { FC } from 'react';
import { includes, isFunction, map } from 'lodash';

import { StatInfo } from '@frakt/components/StatInfo';
import { MarketPreview } from '@frakt/api/bonds';
import Button from '@frakt/components/Button';

import { DURATIONS_OPTIONS as durationOptions, statInfos } from '../constants';
import styles from '../LendCard.module.scss';

export const CollectionsStats: FC<{ market: MarketPreview }> = ({ market }) => (
  <div className={styles.stats}>{renderStatInfos(market)}</div>
);

const renderStatInfos = (market: MarketPreview) => {
  return statInfos.map((statInfo) => {
    const { key, secondValue, valueRenderer, ...rest } = statInfo;
    const value = market[key];
    const computedSecondValue = isFunction(secondValue)
      ? secondValue(market)
      : secondValue;

    const computedValue = valueRenderer ? valueRenderer(value) : value;

    return (
      <StatInfo
        key={key}
        value={computedValue}
        classNamesProps={{ label: styles.label }}
        secondValue={computedSecondValue}
        {...rest}
      />
    );
  });
};

export const renderDurationButtons = (duration: number[]) => {
  return (
    <div className={styles.durationButtons}>
      {map(durationOptions, ({ label, value }) => (
        <Button
          type="tertiary"
          key={value}
          disabled={!includes(duration, value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};
