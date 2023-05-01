import {
  BOND_DECIMAL_DELTA,
  useMarket,
  useMarketPairs,
} from '@frakt/utils/bonds';
import { useWallet } from '@solana/wallet-adapter-react';

import { Bond } from '@frakt/api/bonds';
import { Loan, LoanType } from '@frakt/api/loans';

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

export const getMarketAndPairsByLoan = (loan: Loan) => {
  const { publicKey } = useWallet();
  if (loan.loanType != LoanType.BOND) return {};
  const { market, isLoading: marketLoading } = useMarket({
    marketPubkey: loan.bondParams?.marketPubkey,
  });

  //? Filter wallet pairs (to prevent selling to yourself)
  const { pairs: rawPairs, isLoading: pairsLoading } = useMarketPairs({
    marketPubkey: loan.bondParams?.marketPubkey,
  });

  const pairs = rawPairs
    .filter(({ currentSpotPrice }) => currentSpotPrice <= BOND_DECIMAL_DELTA)
    .filter(({ assetReceiver }) => assetReceiver !== publicKey?.toBase58());

  return { market, pairs: pairs, isLoading: pairsLoading || marketLoading };
};
