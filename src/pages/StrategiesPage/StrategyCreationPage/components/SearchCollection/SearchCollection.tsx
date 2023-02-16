import { FC, useMemo, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { Loader } from '@frakt/components/Loader';
import { SearchInput } from '@frakt/components/SearchInput';
import { Selected } from '@frakt/icons';
import { Market } from '@frakt/api/bonds';
import { useDebounce, useOnClickOutside } from '@frakt/hooks';
import { FormValues } from '../../types';
import styles from './SearchCollection.module.scss';

interface SearchCollectionProps {
  markets: Market[];
  isLoading: boolean;
  formValues: FormValues;
  setFormValues: (prev) => void;
}

const SearchCollection: FC<SearchCollectionProps> = ({
  markets,
  isLoading,
  formValues,
  setFormValues,
}) => {
  const ref = useRef(null);

  const [searchString, setSearchString] = useState<string>('');
  const [focus, setFocus] = useState<boolean>(false);

  const searchDebounced = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  useOnClickOutside(ref, () => setFocus(false));

  const handleSelectedMarkets = (market: Market) => () => {
    setFormValues((prev) => ({
      ...prev,
      selectedMarket: {
        marketName: market.collectionName,
        marketPubkey: market.marketPubkey,
      },
    }));
    // const isMarketAlreadyInList = selectedMarkets.includes(marketPubkey);
    // isMarketAlreadyInList
    //   ? setSelectedMarkets((prev) => prev.filter((el) => el !== marketPubkey))
    //   : setSelectedMarkets((prev) => [...prev, marketPubkey]);
  };

  // const isSelected = (marketPubkey: string) => {
  //   return formValues.selectedMarkets.find((el) => el === marketPubkey);
  // };

  const filteredMarkets = useMemo(() => {
    if (markets?.length) {
      return markets.filter((market) => {
        const marketName = market.collectionName;
        return marketName
          ? marketName.toUpperCase().includes(searchString)
          : false;
      });
    }
  }, [markets, searchString]);

  return (
    <div className={styles.searchCollection}>
      <div className={styles.label}>select collections: {markets?.length}</div>
      <SearchInput
        onChange={(event) => searchDebounced(event.target.value || '')}
        onClick={() => setFocus(true)}
        className={styles.searchInput}
        placeholder="Search by name"
      />

      {focus && (
        <div
          className={classNames(styles.frame, { [styles.centered]: isLoading })}
        >
          {isLoading && <Loader />}

          {!isLoading && (
            <div className={styles.collections} ref={ref}>
              {filteredMarkets.map((market) => (
                <div
                  key={market.marketPubkey}
                  className={styles.item}
                  onClick={handleSelectedMarkets(market)}
                >
                  <div
                    className={classNames(styles.image, {
                      [styles.selected]:
                        formValues.selectedMarket.marketPubkey ===
                        market.marketPubkey,
                    })}
                    style={{
                      backgroundImage: `url(${market.collectionImage})`,
                    }}
                  >
                    {formValues.selectedMarket.marketPubkey ===
                      market.marketPubkey && <Selected />}
                  </div>
                  <div className={styles.title}>{market.collectionName}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchCollection;
