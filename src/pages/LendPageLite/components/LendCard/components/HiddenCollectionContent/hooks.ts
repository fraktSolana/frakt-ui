import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { isEmpty } from 'lodash';

import { useMarketPairs } from '@frakt/utils/bonds';
import { useTabs } from '@frakt/components/Tabs';

import { SyntheticParams } from '../OrderBookLite';
import { BONDS_TABS } from './constants';

export const useHiddenCollectionContent = (marketPubkey: string) => {
  const { publicKey } = useWallet();

  const [pairPubkey, setPairPubkey] = useState<string>('');
  const [syntheticParams, setSyntheticParams] = useState<SyntheticParams>(null);

  const editMode = !!pairPubkey;

  const { pairs, isLoading } = useMarketPairs({ marketPubkey });

  const userOffers = useMemo(() => {
    return pairs.filter((pair) => pair.assetReceiver === publicKey?.toBase58());
  }, [pairs, publicKey]);

  const {
    tabs: bondTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: BONDS_TABS,
    defaultValue: BONDS_TABS[0].value,
  });

  useEffect(() => {
    const shouldSetOfferTab =
      !isEmpty(pairs) && isEmpty(userOffers) && !isLoading;

    if (shouldSetOfferTab || editMode) {
      setTabValue(BONDS_TABS.at(-1).value);
    }
  }, [isLoading, editMode]);

  return {
    syntheticParams,
    isLoading,
    marketParams: {
      pairPubkey,
      marketPubkey,
      setSyntheticParams,
      setPairPubkey,
    },
    tabsParams: {
      tabs: bondTabs,
      value: tabValue,
      setValue: setTabValue,
    },
  };
};
