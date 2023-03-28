import { useParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

import { useFetchAllUserBonds, useWalletBonds } from '@frakt/utils/bonds';

export enum MarketTabsNames {
  HISTORY = 'history',
  BONDS = 'bonds',
}

export const useMarketsPage = () => {
  const wallet = useWallet();

  const { marketPubkey, walletPubkey } = useParams<{
    marketPubkey: string;
    walletPubkey?: string;
  }>();

  const { bonds, isLoading: bondsLoanding } = useWalletBonds({
    walletPubkey: wallet.publicKey,
    marketPubkey: marketPubkey && new web3.PublicKey(marketPubkey),
  });

  const {
    bonds: userBonds,
    // isLoading: userBondsLoanding,
    hideBond: hideUserBond,
  } = useFetchAllUserBonds({ walletPubkey });

  return {
    bonds: walletPubkey && userBonds?.length ? userBonds : bonds,
    hideUserBond,
    loading: false,
  };
};
