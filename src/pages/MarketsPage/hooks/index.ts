import { useParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { web3 } from '@frakt-protocol/frakt-sdk';

import {
  useFetchAllUserBonds,
  useMarket,
  useWalletBonds,
} from '@frakt/utils/bonds';
import { MarketPreview, fetchMarketsPreview } from '@frakt/api/bonds';

type UseMarketsPreview = () => {
  marketsPreview: MarketPreview[];
  isLoading: boolean;
};

export const useMarketsPreview: UseMarketsPreview = () => {
  const { data, isLoading } = useQuery(
    ['marketsPreview'],
    () => fetchMarketsPreview(),
    {
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    marketsPreview: data || [],
    isLoading,
  };
};

export const useMarketsPage = () => {
  const wallet = useWallet();

  const { marketPubkey, walletPubkey } = useParams<{
    marketPubkey: string;
    walletPubkey?: string;
  }>();

  const { bonds, isLoading: bondsLoanding } = useWalletBonds({
    walletPubkey: wallet.publicKey,
    marketPubkey: new web3.PublicKey(marketPubkey),
  });

  const {
    bonds: userBonds,
    // isLoading: userBondsLoanding,
    hideBond: hideUserBond,
  } = useFetchAllUserBonds({ walletPubkey });

  const { market, isLoading: marketLoading } = useMarket({
    marketPubkey,
  });

  const loading = bondsLoanding;

  return {
    bonds: walletPubkey && userBonds?.length ? userBonds : bonds,
    hideUserBond,
    loading,
    market,
    marketLoading,
    marketPubkey,
  };
};
