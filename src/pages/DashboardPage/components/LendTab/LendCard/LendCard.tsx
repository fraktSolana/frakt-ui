import { FC } from 'react';

import styles from './LendCard.module.scss';

interface LendCardProps {
  image: string;
  depositYield: number;
  name: string;
}

const LendCard: FC<LendCardProps> = ({ name, image, depositYield }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <img className={styles.cardImage} src={image} />
        <p className={styles.cardName}>{name}</p>
      </div>
      <p>{depositYield?.toFixed(4)}</p>
      <p>{depositYield?.toFixed(4)}</p>
    </div>
  );
};

export default LendCard;
