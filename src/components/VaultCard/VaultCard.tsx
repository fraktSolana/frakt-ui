import styles from './styles.module.scss';
import DoneIcon from '../../icons/DoneIcon';
import Badge from '../Badge';
import { shortenAddress } from '../../external/utils/utils';

export interface VaultCardProps {
  name: string;
  owner: string;
  tags: string[];
  imageSrc: string;
  totalSupply?: string;
  collectableSupply?: string;
  impliedValuation?: string;
}

const VaultCard = ({
  name,
  owner,
  tags,
  imageSrc,
  totalSupply = 'XXX',
  collectableSupply = 'XXX',
  impliedValuation = 'XXX',
}: VaultCardProps): JSX.Element => (
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
          <div className={styles.value}>{totalSupply}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>Collectable supply</div>
          <div className={styles.value}>{collectableSupply}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>Implied valuation</div>
          <div className={styles.value}>${impliedValuation}</div>
        </div>
      </div>
    </div>
  </div>
);

export default VaultCard;