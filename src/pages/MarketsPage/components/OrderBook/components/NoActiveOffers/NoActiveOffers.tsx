import { FC } from 'react';
import classNames from 'classnames';

import PartyHorn from '@frakt/icons/PartyHorn';

import styles from './NoActiveOffers.module.scss';

interface NoActiveOffersProps {
  openOffersMobile: boolean;
  ltv: number;
}

const NoActiveOffers: FC<NoActiveOffersProps> = ({ openOffersMobile, ltv }) => {
  return (
    <div
      className={classNames(styles.noData, {
        [styles.active]: openOffersMobile,
        [styles.create]: ltv,
      })}
    >
      <PartyHorn />
      <div className={styles.noDataTitle}>No active offers at the moment</div>
      <div className={styles.noDataSubtitle}>Good chance to be first!</div>
    </div>
  );
};

export default NoActiveOffers;
