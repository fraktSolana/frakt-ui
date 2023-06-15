import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { map, sum } from 'lodash';

import { useMarketsPreview } from '@frakt/pages/MarketsPage/hooks';
import { StatInfo } from '@frakt/components/StatInfo';
import { Button } from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';

import styles from './GeneralLendInfo.module.scss';

const GeneralInfo: FC = () => {
  const { marketsPreview } = useMarketsPreview();

  const offersTVL = sum(
    map(marketsPreview, ({ offerTVL }) => parseFloat(offerTVL)),
  );
  const loansTVL = sum(map(marketsPreview, 'loansTVL'));

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <h3 className={styles.title}>Lend</h3>
        <SwitcherMode />
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

export default GeneralInfo;

const SwitcherMode = () => {
  const history = useHistory();
  const pathname = `/${history.location.pathname.split('/')[1]}`;

  const renderButton = (path: string, label: string) => (
    <Button
      onClick={() => history.push(path)}
      className={classNames(styles.button, {
        [styles.active]: pathname === path,
      })}
      type="tertiary"
    >
      {label}
    </Button>
  );

  return (
    <div className={styles.switcher}>
      {renderButton(PATHS.BONDS_LITE, 'Lite')}
      {renderButton(PATHS.BONDS, 'Pro')}
    </div>
  );
};
