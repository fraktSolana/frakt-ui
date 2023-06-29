import { FC } from 'react';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import { useFakeInfinityScroll } from '@frakt/components/InfinityScroll';
import { useVisibleMarketURLControl } from '@frakt/hooks';
import { Button } from '@frakt/components/Button';
import { Loader } from '@frakt/components/Loader';

import { useFilteredMarkets } from './hooks';
import FilterSection from '../FilterSection';
import LendCard from '../LendCard';

import styles from './LendLitePageContent.module.scss';

const LendLitePageContent: FC = () => {
  const {
    marketsPreview,
    isLoading,
    checked,
    onToggleChange,
    marketsToDisplay,
    handleFilterChange,
    isMarketPubkeyPresent,
    handleSortChange,
    showEmptyList,
    selectedMarkets,
  } = useFilteredMarkets();

  const { data, fetchMoreTrigger } = useFakeInfinityScroll({
    rawData: marketsToDisplay,
    enabled: !!marketsToDisplay?.length,
  });

  const { visibleCards, toggleVisibleCard } = useVisibleMarketURLControl();

  return (
    <div
      className={classNames(styles.content, {
        [styles.selected]: isMarketPubkeyPresent,
      })}
    >
      <FilterSection
        marketsPreview={marketsPreview}
        onFilterChange={handleFilterChange}
        selectedMarkets={selectedMarkets}
        handleSortChange={handleSortChange}
        onToggleChange={onToggleChange}
        checked={checked}
      />
      {isLoading && isEmpty(marketsPreview) ? (
        <Loader />
      ) : (
        <>
          {data.map((market, id) => (
            <LendCard
              market={market}
              key={`${market.marketPubkey}_${id}`}
              isVisible={visibleCards.includes(market.collectionName)}
              onCardClick={() => toggleVisibleCard(market.collectionName)}
            />
          ))}
          <div ref={fetchMoreTrigger} />
        </>
      )}
      {showEmptyList && <EmptyList onClick={onToggleChange} />}
    </div>
  );
};

export default LendLitePageContent;

const EmptyList = ({ onClick }: { onClick: () => void }) => (
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
