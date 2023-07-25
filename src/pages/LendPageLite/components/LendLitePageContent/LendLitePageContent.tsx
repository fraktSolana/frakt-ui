import { FC } from 'react';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import { useFakeInfinityScroll } from '@frakt/components/InfinityScroll';
import { useVisibleMarketURLControl } from '@frakt/hooks';
import { Loader } from '@frakt/components/Loader';

import { EmptyList, MarketsList } from './components';
import { useFilteredMarkets } from './hooks';
import FilterSection from '../FilterSection';

import styles from './LendLitePageContent.module.scss';

const LendLitePageContent: FC = () => {
  const {
    marketsPreview,
    isLoading,
    checked,
    onToggleChange,
    marketsToDisplay,
    handleFilterChange,
    sortParams,
    showEmptyList,
    selectedMarkets,
  } = useFilteredMarkets();

  const { data: markets, fetchMoreTrigger } = useFakeInfinityScroll({
    rawData: marketsToDisplay,
    enabled: !!marketsToDisplay?.length,
  });

  const { visibleCards, toggleVisibleCard } = useVisibleMarketURLControl();

  return (
    <div
      className={classNames(styles.content, {
        [styles.selected]: !!visibleCards?.length,
      })}
    >
      <FilterSection
        marketsPreview={marketsPreview}
        onFilterChange={handleFilterChange}
        selectedMarkets={selectedMarkets}
        sortParams={sortParams}
        onToggleChange={onToggleChange}
        checked={checked}
      />
      {isLoading && isEmpty(marketsPreview) ? (
        <Loader />
      ) : (
        <MarketsList
          markets={markets}
          visibleCards={visibleCards}
          toggleVisibleCard={toggleVisibleCard}
          fetchMoreTrigger={fetchMoreTrigger}
        />
      )}
      {showEmptyList && <EmptyList onClick={onToggleChange} />}
    </div>
  );
};

export default LendLitePageContent;
