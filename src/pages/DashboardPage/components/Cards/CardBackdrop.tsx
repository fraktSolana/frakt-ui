import { FC, PropsWithChildren } from 'react';
import classNames from 'classnames';

import styles from './Cards.module.scss';

interface CardBackdropProps {
  onClick?: () => void;
  className?: string;
  image: string;
}

export const CardBackdrop: FC<PropsWithChildren<CardBackdropProps>> = ({
  className,
  onClick,
  image,
  children,
}) => (
  <div
    onClick={onClick ? onClick : null}
    className={classNames(styles.card, className, {
      [styles.clicable]: onClick,
    })}
  >
    <img src={image} className={styles.nftImage} />
    {children}
  </div>
);
