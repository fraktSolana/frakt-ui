import { FC } from 'react';

import { MarketPreview } from '@frakt/api/bonds';
import { TABLET_SIZE } from '@frakt/constants';
import Button from '@frakt/components/Button';
import { useWindowSize } from '@frakt/hooks';

import LendCard from '../LendCard';

import styles from './LendLitePageContent.module.scss';

export const EmptyList = ({ onClick }: { onClick: () => void }) => (
  <div className={styles.emptyList}>
    <h4 className={styles.emptyListTitle}>You don’t have any deposits</h4>
    <Button
      type="secondary"
      onClick={onClick}
      className={styles.emptyListButton}
    >
      View collections
    </Button>
  </div>
);

interface MarketsListProps {
  markets: MarketPreview[];
  visibleCards: string[];
  toggleVisibleCard: (collectionName: string) => void;
  fetchMoreTrigger: (node?: Element) => void;
}

export const MarketsList: FC<MarketsListProps> = ({
  markets,
  visibleCards,
  toggleVisibleCard,
  fetchMoreTrigger,
}) => {
  const { width } = useWindowSize();
  const isMobile = width < TABLET_SIZE;

  return (
    <>
      {markets.map((market: MarketPreview, id: number) => {
        const { collectionName, marketPubkey } = market;

        const cardIsOpen = visibleCards.includes(collectionName);

        const shouldVisibleOrderBook = isMobile
          ? visibleCards.at(-1) === collectionName
          : cardIsOpen;

        return (
          <LendCard
            key={`${marketPubkey}_${id}`}
            market={market}
            onCardClick={() => toggleVisibleCard(collectionName)}
            visibleOrderBook={shouldVisibleOrderBook}
            isVisible={cardIsOpen}
          />
        );
      })}
      <div ref={fetchMoreTrigger} />
    </>
  );
};
