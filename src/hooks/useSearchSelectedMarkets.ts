import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { create } from 'zustand';

type SearchSelectedMarketsStore = {
  selectedMarkets: string[];
  setSelectedOptions: (value: string[]) => void;
};

const useSearchSelectedMarkets = create<SearchSelectedMarketsStore>((set) => {
  return {
    selectedMarkets: [],
    setSelectedOptions: (value) => {
      set(() => ({ selectedMarkets: value }));
    },
  };
});

export const useSearchSelectedMarketsURLControl = () => {
  const history = useHistory();
  const { selectedMarkets, setSelectedOptions } = useSearchSelectedMarkets();

  useEffect(() => {
    const params = new URLSearchParams(history.location.search);

    params.delete('collections');

    if (selectedMarkets.length > 0) {
      params.append('collections', selectedMarkets?.join(','));
    }

    history.push({ search: params.toString() });
  }, [selectedMarkets, history]);

  return { selectedMarkets, setSelectedOptions };
};
