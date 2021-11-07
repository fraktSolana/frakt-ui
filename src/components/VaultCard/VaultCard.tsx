import BN from 'bn.js';

import styles from './styles.module.scss';
import { DoneIcon } from '../../icons';
import Badge from '../Badge';
import { shortenAddress } from '../../external/utils/utils';
import { decimalBNToString } from '../../utils';
import fraktionConfig from '../../contexts/fraktion/config';

export interface VaultCardProps {
  name: string;
  owner: string;
  tags: string[];
  imageSrc: string;
  supply?: BN;
  pricePerFraction?: BN;
  priceTokenMint: string;
}

const VaultCard = ({
  name,
  owner,
  tags,
  imageSrc,
  supply = new BN(0),
  pricePerFraction = new BN(0),
  priceTokenMint,
}: VaultCardProps): JSX.Element => {
  const currency =
    priceTokenMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${imageSrc})` }}
        >
          <div className={styles.actions}>
            <DoneIcon />
            {tags.map((tag, idx) => (
              <Badge key={idx} label={tag} className={styles.badge} />
            ))}
          </div>
        </div>
        <div className={styles.nameContainer}>
          <div className={styles.name}>{name}</div>
          <div className={styles.owner}>{shortenAddress(owner)}</div>
        </div>
        <div className={styles.stats}>
          <div className={styles.item}>
            <div className={styles.title}>Total supply</div>
            <div className={styles.value}>{supply.toString().slice(0, -3)}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>Fraction price ({currency})</div>
            <div className={styles.value}>
              {decimalBNToString(pricePerFraction.mul(new BN(1e3)), 6, 9)}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>Buyout price ({currency})</div>
            <div className={styles.value}>
              {decimalBNToString(pricePerFraction.mul(supply), 2, 9)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultCard;
