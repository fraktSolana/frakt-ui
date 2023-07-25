import { FC, useEffect, useRef } from 'react';
import classNames from 'classnames';

import { useContainerWidth } from '@frakt/hooks';
import { MarketPreview } from '@frakt/api/bonds';
import { ChevronDown } from '@frakt/icons';

import { GeneralCollectionInfo } from './components/GeneralCollectionInfo/GeneralCollectionInfo';
import HiddenCollectionContent from './components/HiddenCollectionContent';
import { CollectionsStats } from './components/CollectionsStats';
import LendCardHeader from './components/LendCardHeader';

import styles from './LendCard.module.scss';

const STOP_WIDTH = 1240;

interface LendCardProps {
  market: MarketPreview;
  isVisible: boolean;
  visibleOrderBook: boolean;
  onCardClick: () => void;
}

const LendCard: FC<LendCardProps> = ({
  isVisible,
  onCardClick,
  market,
  visibleOrderBook,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [isVisible]);

  const { containerRef, containerWidth } = useContainerWidth(STOP_WIDTH);

  return (
    <div
      ref={cardRef}
      className={classNames(styles.card, {
        [styles.active]: market?.selected,
      })}
    >
      {market?.user && (
        <LendCardHeader
          userInfo={market.user}
          onClick={onCardClick}
          containerWidth={containerWidth}
        />
      )}
      <LendCardBody
        onClick={onCardClick}
        market={market}
        active={isVisible}
        containerRef={containerRef}
      />
      {isVisible && (
        <HiddenCollectionContent
          visibleOrderBook={visibleOrderBook}
          marketPubkey={market?.marketPubkey}
        />
      )}
    </div>
  );
};

export default LendCard;

const LendCardBody = ({ onClick, market, active, containerRef }) => (
  <div className={styles.cardBody} onClick={onClick}>
    <div className={styles.fullWidthContainer} ref={containerRef}>
      <GeneralCollectionInfo {...market} />
    </div>
    <div className={styles.row}>
      <CollectionsStats market={market} />
      <ChevronButton active={active} />
    </div>
  </div>
);

const ChevronButton = ({ active = false }) => (
  <div
    className={classNames(styles.chevronButton, {
      [styles.active]: active,
    })}
  >
    <ChevronDown />
  </div>
);
