import { filter } from 'lodash';
import { useWallet } from '@solana/wallet-adapter-react';

import { Bond, Market, Pair } from '@frakt/api/bonds';
import { exitBond, isBondAvailableToRedeem } from '@frakt/utils/bonds';

import { useConnection } from './useConnection';
import { Order } from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2';
import { BondCartOrder } from '@frakt/api/nft';

type UseBondsTransactions = ({
  bonds,
  hideBond,
  market,
}: {
  bonds: Bond[];
  hideBond: any;
  market?: Market;
}) => {
  onClaimAll: () => Promise<void>;
  onRedeem: (bond: Bond) => Promise<void>;
  onExit: ({
    bond,
    bondOrderParams,
  }: {
    bond: Bond;
    bondOrderParams: BondCartOrder[];
  }) => Promise<void>;
};

export const useBondsTransactions: UseBondsTransactions = ({
  bonds,
  hideBond,
  market,
}) => {
  const wallet = useWallet();
  const connection = useConnection();

  const onClaimAll = async () => {
    try {
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error?.logs?.join('\n'));
      console.error(error);
    }
  };

  const onRedeem = async (bond: Bond) => {
    try {
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
