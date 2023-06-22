import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { Bond, Market } from '@frakt/api/bonds';
import { exitBond } from '@frakt/utils/bonds';

import { BondCartOrder } from '@frakt/api/nft';

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
      // eslint-disable-next-line no-console
      console.warn(error?.logs?.join('\n'));
      console.error(error);
    }
  };

  const onRedeem = (bond: Bond) => {
    try {
      //
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error?.logs?.join('\n'));
      console.error(error);
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
      // eslint-disable-next-line no-console
      console.warn(error?.logs?.join('\n'));
      console.error(error);
    }
  };

  return { onClaimAll, onRedeem, onExit };
};
