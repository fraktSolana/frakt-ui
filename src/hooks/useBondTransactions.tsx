import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { Bond, Market } from '@frakt/api/bonds';
import { exitBond } from '@frakt/utils/bonds';

import { BondCartOrder } from '@frakt/api/nft';
import { logTxnError } from '@frakt/utils';

export const useBondsTransactions = ({
  bonds,
  hideBond,
  market,
}: {
  bonds: Bond[];
  hideBond: any;
  market?: Market;
}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const onClaimAll = () => {
    try {
      //
    } catch (error) {
      logTxnError(error);
    }
  };

  const onRedeem = (bond: Bond) => {
    try {
      //
    } catch (error) {
      logTxnError(error);
    }
  };

  const onExit = async ({
    bond,
    bondOrderParams,
  }: {
    bond: Bond;
    bondOrderParams: BondCartOrder[];
  }) => {
    try {
      const result = await exitBond({
        bond,
        bondOrderParams,
        market,
        wallet,
        connection,
      });

      if (result) {
        hideBond(bond?.fbond?.publicKey);
      }
    } catch (error) {
      logTxnError(error);
    }
  };

  return { onClaimAll, onRedeem, onExit };
};
