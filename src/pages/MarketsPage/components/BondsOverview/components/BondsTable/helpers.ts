import {
  BOND_DECIMAL_DELTA,
  useMarket,
  useMarketPairs,
} from '@frakt/utils/bonds';
import { useWallet } from '@solana/wallet-adapter-react';

import { Bond } from '@frakt/api/bonds';

export const getMarketAndPairsByBond = (bond: Bond) => {
  const { publicKey } = useWallet();

  const { market, isLoading: marketLoading } = useMarket({
    marketPubkey: bond?.marketPubkey,
  });

  //? Filter wallet pairs (to prevent selling to yourself)
  const { pairs: rawPairs, isLoading: pairsLoading } = useMarketPairs({
    marketPubkey: bond?.marketPubkey,
  });

  const pairs = rawPairs
    .filter(({ currentSpotPrice }) => currentSpotPrice <= BOND_DECIMAL_DELTA)
    .filter(({ assetReceiver }) => assetReceiver !== publicKey?.toBase58());

  return { market, pairs, isLoading: pairsLoading || marketLoading };
};
