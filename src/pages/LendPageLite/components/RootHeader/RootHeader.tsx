import { FC } from 'react';
import { map, sum } from 'lodash';

import { useMarketsPreview } from '@frakt/pages/MarketsPage/hooks';
import { StatInfo } from '@frakt/components/StatInfo';

import styles from './RootHeader.module.scss';

interface RootHeaderProps {
  mode: LendMode;
  onModeSwitch: () => void;
}

export const RootHeader: FC<RootHeaderProps> = ({ mode, onModeSwitch }) => {
  const { marketsPreview } = useMarketsPreview();

  const offersTVL = sum(
    map(marketsPreview, ({ offerTVL }) => parseFloat(offerTVL)),
  );
  const loansTVL = sum(map(marketsPreview, 'loansTVL'));

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <h3 className={styles.title}>Lend</h3>
        <ModeSwitcher value={mode} onClick={onModeSwitch} />
      </div>
      <div className={styles.stats}>
        <StatInfo label="In offers:" value={offersTVL} flexType="row" />
        <StatInfo
          label="In loans:"
          value={loansTVL}
          divider={1e9}
          flexType="row"
        />
      </div>
    </div>
  );
};

export enum LendMode {
  LITE = 'Lite',
  PRO = 'Pro',
}

interface ModeSwitcherProps {
  value: LendMode;
  onClick?: () => void;
}

export const ModeSwitcher: FC<ModeSwitcherProps> = ({ value, onClick }) => {
  const isProMode = value === LendMode.PRO;

  return (
    <label className={styles.switcher} onClick={onClick}>
      <input className={styles.input} type="checkbox" checked={isProMode} />
      <div className={styles.modesWrapper}>
        <span>{LendMode.LITE}</span>
        <span>{LendMode.PRO}</span>
      </div>
    </label>
  );
};
