import { FC } from 'react';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import { Loader } from '@frakt/components/Loader';

import FilterSection from '../FilterSection';
import useFilteredMarkets from './hooks';
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
  } = useFilteredMarkets();

  return (
    <div
      className={classNames(styles.content, {
        [styles.selected]: isMarketPubkeyPresent,
      })}
    >
      <FilterSection
        marketsPreview={marketsPreview}
        onFilterChange={handleFilterChange}
        handleSortChange={handleSortChange}
        onToggleChange={onToggleChange}
        checked={checked}
      />
      {isLoading && isEmpty(marketsPreview) ? (
        <Loader />
      ) : (
        marketsToDisplay.map((market, id) => (
          <LendCard market={market} key={`${market.marketPubkey}_${id}`} />
        ))
      )}
    </div>
  );
};

export default LendLitePageContent;
