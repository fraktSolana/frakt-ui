import { FC, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import classNames from 'classnames';

import { useContainerWidth } from '@frakt/hooks';
import { MarketPreview } from '@frakt/api/bonds';
import Button from '@frakt/components/Button';
import { ChevronDown } from '@frakt/icons';
import { PATHS } from '@frakt/constants';

import { GeneralCollectionInfo } from './components/GeneralCollectionInfo/GeneralCollectionInfo';
import HiddenCollectionContent from './components/HiddenCollectionContent';
import { CollectionsStats } from './components/CollectionsStats';
import LendCardHeader from './components/LendCardHeader';

import styles from './LendCard.module.scss';

const STOP_WIDTH = 1240;

const LendCard: FC<{ market: MarketPreview }> = ({ market }) => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const history = useHistory();

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (market?.selected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [market?.selected]);

  const onCardClick = () => {
    const targetPath =
      marketPubkey && market?.selected
        ? PATHS.BONDS_LITE
        : `${PATHS.BONDS_LITE}/${market?.marketPubkey}`;

    history.push(targetPath);
  };

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
        active={market?.selected}
        containerRef={containerRef}
      />
      {market?.selected && <HiddenCollectionContent />}
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
  <Button
    type="tertiary"
    className={classNames(styles.chevronButton, {
      [styles.active]: active,
    })}
  >
    <ChevronDown />
  </Button>
);
