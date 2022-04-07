import { NavLink } from 'react-router-dom';
import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import {
  NftPoolData,
  SafetyDepositBoxState,
} from '../../../../../utils/cacher/nftPools';
import styles from './PoolCard.module.scss';
import { createPoolLink, POOL_TABS } from '../../../../../constants';
import { SolanaIcon } from '../../../../../icons';
import { pluralize } from '../../../../../utils';
import { useAPR } from '../../../hooks';

interface PoolCardProps {
  pool: NftPoolData;
  poolTokenInfo: TokenInfo;
  price: string;
}

export const PoolCard: FC<PoolCardProps> = ({ pool, poolTokenInfo, price }) => {
  const { publicKey, safetyBoxes } = pool;

  const { liquidityAPR } = useAPR(poolTokenInfo);

  const nftsAmount = safetyBoxes.length;

  const poolImage = pool.safetyBoxes.filter(
    ({ safetyBoxState }) => safetyBoxState === SafetyDepositBoxState.LOCKED,
  )?.[0]?.nftImage;

  const poolName = poolTokenInfo?.name || '';
  const tokenImage = poolTokenInfo?.logoURI || '';
  const tokenName = poolTokenInfo?.symbol || '';

  return (
    <NavLink
      to={createPoolLink(POOL_TABS.BUY, publicKey.toBase58())}
      className={styles.poolCardWrapper}
    >
      <div className={styles.poolCard}>
        <div className={styles.poolImgWrapper}>
          <img src={poolImage} alt="Pool card" className={styles.poolImage} />
          <div className={styles.poolShadow}>
            {/* <p className={styles.poolInfoLabel}>
              {pluralize(4, 'collection')}
            </p> */}
            <p className={styles.poolInfoLabel}>
              {pluralize(nftsAmount, 'item')}
            </p>
          </div>
        </div>
        <div className={styles.cardContentWrapper}>
          <p className={styles.poolName}>{poolName}</p>
          <div className={styles.poolTokenInfo}>
            <div
              className={styles.tokenImage}
              style={{ backgroundImage: `url(${tokenImage})` }}
            />
            <p className={styles.tokenName}>{tokenName}</p>
          </div>
          <span className={styles.priceLabel}>price</span>
          <div className={styles.priceWrapper}>
            <span>{parseFloat(price)?.toFixed(2)}</span>
            <SolanaIcon />
            <span>SOL</span>
          </div>

          <div className={styles.aprWrapper}>
            <p className={styles.aprLabel}>Staking APR</p>
            <div className={styles.aprValue}>
              {liquidityAPR.toFixed(2) || 0} %
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
};