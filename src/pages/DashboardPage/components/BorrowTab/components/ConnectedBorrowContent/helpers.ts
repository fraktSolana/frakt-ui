import { BondOfferV2 } from 'fbonds-core/lib/fbond-protocol/types';
import { web3 } from '@frakt-protocol/frakt-sdk';
import {
  BOND_DECIMAL_DELTA,
  getBestOrdersByBorrowValue,
} from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2';

import { pairLoanDurationFilter } from '@frakt/utils/bonds';
import {
  BondOrderParams,
  convertTakenOrderToOrderParams,
  patchPairWithProtocolFee,
} from '@frakt/pages/BorrowPages/cartState';
import { BorrowNft } from '@frakt/api/nft';
import { Market } from '@frakt/api/bonds';

const getBondOrderParams = ({
  market,
  pairs,
  nft,
}: {
  market: Market;
  pairs: BondOfferV2[];
  nft: BorrowNft;
}): BondOrderParams => {
  const { takenOrders } = getBestOrdersByBorrowValue({
    borrowValue: nft?.maxLoanValue,
    collectionFloor: market?.oracleFloor?.floor,
    bondOffers: pairs.filter((pair) => pairLoanDurationFilter({ pair })),
  });

  const bondOrderParams = {
    market,
    orderParams: takenOrders.map((order) => {
      const affectedPair = pairs.find(
        (pair) => pair.publicKey === order.pairPubkey,
      );

      return convertTakenOrderToOrderParams({
        pair: affectedPair,
        takenOrder: order,
      });
    }),
  };

  return bondOrderParams;
};

const filterPairs = (pairs: BondOfferV2[], walletPubkey: web3.PublicKey) => {
  return pairs
    .filter(({ currentSpotPrice }) => currentSpotPrice <= BOND_DECIMAL_DELTA)
    .map(patchPairWithProtocolFee)
    .filter(({ assetReceiver }) => assetReceiver !== walletPubkey?.toBase58());
};

export { getBondOrderParams, filterPairs };
