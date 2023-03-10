import { filter } from 'lodash';
import { useWallet } from '@solana/wallet-adapter-react';

import { Bond, Market, Pair } from '@frakt/api/bonds';
import {
  exitBond,
  isBondAvailableToRedeem,
  redeemAllBonds,
  redeemBond,
} from '@frakt/utils/bonds';

import { useConnection } from './useConnection';
import { Order } from 'fbonds-core/lib/fbond-protocol/utils/cartManager';
import { BondOrderParams } from '@frakt/api/nft';

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
    bondOrderParams: BondOrderParams[];
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
      const bondsAvailableToRedeem = filter(bonds, isBondAvailableToRedeem);

      const result = await redeemAllBonds({
        bonds: bondsAvailableToRedeem,
        wallet,
        connection,
      });

      if (result) {
        bondsAvailableToRedeem.forEach(({ fbond }) => {
          hideBond?.(fbond?.publicKey);
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error?.logs?.join('\n'));
      console.error(error);
    }
  };

  const onRedeem = async (bond: Bond) => {
    try {
      const result = await redeemBond({
        bond,
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

  const onExit = async ({
    bond,
    bondOrderParams,
  }: {
    bond: Bond;
    bondOrderParams: BondOrderParams[];
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
