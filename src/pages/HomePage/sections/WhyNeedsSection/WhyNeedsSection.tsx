import classNames from 'classnames/bind';

import styles from './styles.module.scss';

interface WhyNeedsSectionProps {
  className?: string;
}

const WhyNeedsSection = ({ className }: WhyNeedsSectionProps): JSX.Element => {
  return (
    <div className={classNames([styles.whyNeeds, className])}>
      <h3 className={styles.title}>Why NFT community needs this?</h3>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h5 className={styles.cardTitle}>Accesibility</h5>
          <p className={styles.cardText}>
            “Blue chip” NFTs are viewed as the safe bets. They tend to
            appreciate in value in bull markets and to maintain their value the
            best in bear markets when everybody tries to be careful with their
            investments. The problem is these NFTs come with a price tag which
            is prohibitive to most investors. We solve this by providing an open
            protocol for on chain NFT fractionalization allowing people to
            purchase fractions of solid projects.
          </p>
        </div>
        <div className={styles.card}>
          <h5 className={styles.cardTitle}>Liquidity</h5>
          <p className={styles.cardText}>
            Many people who own expensive NFTs often lack liquidity to pursue
            other profitable activities. They don’t want to sell their blue chip
            NFT, they just want to collateralise it for cash. Maybe they want to
            sell only 30% of it and that’s fine. We solve this by providing an
            open protocol for on chain NFT fractionalization allowing people to
            get liquidity for fractions of their NFT, without selling the whole
            thing.
          </p>
        </div>
        <div className={styles.card}>
          <h5 className={styles.cardTitle}>
            Open sourced and community-driven
          </h5>
          <p className={styles.cardText}>
            Whole protocol source code is opensourced and built on top of
            Metaplex. As a project that highly depends on NFT communities we
            believe it should be fully transparent and run by DAO.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyNeedsSection;