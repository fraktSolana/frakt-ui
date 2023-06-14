import { FC } from 'react';
import { StatInfo } from '@frakt/components/StatInfo';
import { UserMarketPreview } from '@frakt/api/bonds';

import styles from './LendCardHeader.module.scss';

interface LendCardHeaderProps {
  userInfo: UserMarketPreview;
  onClick: () => void;
  containerWidth: number;
}

const LendCardHeader: FC<LendCardHeaderProps> = ({
  userInfo,
  onClick,
  containerWidth,
}) => (
  <div
    style={{ paddingLeft: containerWidth - 44 }}
    className={styles.cardHeader}
    onClick={onClick}
  >
    <span className={styles.cardHeaderTitle}>Mine</span>
    <div className={styles.cardHeaderStats}>
      <StatInfo
        value={userInfo?.offerTVL}
        secondValue={`in ${userInfo?.offerAmount} offers`}
        divider={1e9}
      />
      <StatInfo
        value={userInfo?.loansTVL}
        secondValue={`in ${userInfo?.bondsAmount} loans`}
        divider={1e9}
      />
    </div>
  </div>
);

export default LendCardHeader;
