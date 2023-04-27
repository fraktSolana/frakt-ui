import { create } from 'zustand';
import produce from 'immer';
import { reduce, groupBy, map } from 'lodash';
import { calculateNextSpotPrice } from 'fbonds-core/lib/fbond-protocol/helpers';
import { OrderType } from 'fbonds-core/lib/fbond-protocol/types';
import {
  getCurrentOrderSize,
  getTopOrderSize,
} from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2';

import { Pair } from '@frakt/api/bonds';
import { BondCartOrder } from '@frakt/api/nft';
import { LoanType } from '@frakt/api/loans';

import { CartOrder } from './types';

interface CartState {
  pairs: Pair[];
  orders: CartOrder[];
  setCartState: (props: { orders: CartOrder[]; pairs: Pair[] }) => void;
  addOrder: (props: {
    order: CartOrder;
    pairs?: Pair[];
    unshift?: boolean;
  }) => void;
  updateOrder: (props: { order: CartOrder; pairs?: Pair[] }) => void;
  removeOrder: (props: { nftMint: string }) => void;
  findPair: (props: { pairPubkey: string }) => Pair | null;
  findOrder: (props: { nftMint: string }) => CartOrder | null;
  clearCart: () => void;
}

export const useCartState = create<CartState>((set, get) => ({
  pairs: [],
  orders: [],
  setCartState: ({ orders = [], pairs = [] }) => {
    return set(
      produce((state: CartState) => {
        state.orders = orders;
        state.pairs = pairs;
      }),
    );
  },
  addOrder: ({ order, pairs = [], unshift = false }) => {
    //! ADD BOND ORDER LOGIC
    //? 1. chunk by pair: [[5, 10], [10, 200, 5]]
    //? 2. loop chunk patch(pair, [5, 100, 5000]) --> patchedPair[]
    //? 3. push pairs to state
    //? 3.1 pair already in state --> replace
    //? 3.2 new pair --> push
    //? 4. push order
    set(
      produce((state: CartState) => {
        const orderInStateIdx = state.orders.findIndex(
          ({ borrowNft }) => borrowNft.mint === order.borrowNft.mint,
        );

        //? Add order to state or modify it if it already exists
        if (orderInStateIdx === -1) {
          unshift ? state.orders.unshift(order) : state.orders.push(order);
        } else {
          state.orders[orderInStateIdx] = order;
        }

        if (order.loanType !== LoanType.BOND) return;

        //? Start pairs manipulations:
        const { orderParams: bondOrders } = order.bondOrderParams;

        const bondOrdersByPair = groupBy(
          bondOrders,
          ({ pairPubkey }) => pairPubkey,
        );

        const patchedPairs = map(pairs, (pair) =>
          patchPairByBondOrders({
            pair,
            bondOrders: bondOrdersByPair[pair.publicKey],
          }),
        );

        patchedPairs.forEach((patchedPair) => {
          const indexOfPairInState = state.pairs.findIndex(
            ({ publicKey }) => publicKey === patchedPair.publicKey,
          );

          if (indexOfPairInState === -1) {
            state.pairs.push(patchedPair);
          } else {
            state.pairs[indexOfPairInState] = patchedPair;
          }
        });
      }),
    );
  },
  removeOrder({ nftMint }) {
    //! REMOVE BOND ORDER LOGIC
    //? 1. Get affected pairs by order
    //? 2. Chunk bondOrders by pairPubkey: [[5, 10], [10, 200, 5]]
    //? 3. loop chunk patchReverse(pair, [5, 100, 5000]) --> patchedPairs[]
    //? 4. push pairs to state
    //? 4.1 pair already in state --> replace
    //? 4.2 new pair --> push
    //? 5. Push order
    set(
      produce((state: CartState) => {
        const order = state.orders.find(
          ({ borrowNft }) => borrowNft.mint === nftMint,
        );
        state.orders = state.orders.filter(
          ({ borrowNft }) => borrowNft.mint !== nftMint,
        );

        if (order.loanType !== LoanType.BOND) return;

        //? Start pairs manipulations:
        const { orderParams: bondOrders } = order.bondOrderParams;

        const bondOrdersByPair = groupBy(
          bondOrders,
          ({ pairPubkey }) => pairPubkey,
        );

        const affectedPairs = state.pairs.filter(({ publicKey }) =>
          Object.keys(bondOrdersByPair).includes(publicKey),
        );

        const patchedPairs = map(affectedPairs, (pair) =>
          patchPairByBondOrders({
            pair,
            bondOrders: bondOrdersByPair[pair.publicKey],
            reverse: true,
          }),
        );

        patchedPairs.forEach((patchedPair) => {
          const indexOfPairInState = state.pairs.findIndex(
            ({ publicKey }) => publicKey === patchedPair.publicKey,
          );

          state.pairs[indexOfPairInState] = patchedPair;
        });
      }),
    );
  },
  updateOrder: ({ order, pairs = [] }) => {
    const { addOrder, removeOrder } = get();

    removeOrder({
      nftMint: order.borrowNft.mint,
    });

    addOrder({
      order,
      pairs,
    });
  },
  findPair: ({ pairPubkey }) => {
    const { pairs } = get();
    return pairs.find(({ publicKey }) => publicKey === pairPubkey) ?? null;
  },
  findOrder: ({ nftMint }) => {
    const { orders } = get();
    return orders.find(({ borrowNft }) => borrowNft.mint === nftMint) ?? null;
  },
  clearCart: () =>
    set(
      produce((state: CartState) => {
        state.orders = [];
        state.pairs = [];
      }),
    ),
}));

const patchPairToNextOrderAfterAdd = (pair: Pair): Pair =>
  pair.bidSettlement === pair.bidCap * -1
    ? {
        ...pair,
        bidSettlement:
          pair.buyOrdersQuantity === 2
            ? -(pair.bidCap - pair.edgeSettlement)
            : 0,
        buyOrdersQuantity: pair.buyOrdersQuantity - 1,
        currentSpotPrice: calculateNextSpotPrice({
          orderType: OrderType.Sell,
          spotPrice: pair.baseSpotPrice,
          delta: pair.bondingCurve.delta,
          bondingCurveType: pair.bondingCurve.bondingType,
          counter: pair.mathCounter,
        }),
        mathCounter: pair.mathCounter - 1,
      }
    : pair;

const patchPairToNextOrderAfterRemove = (pair: Pair): Pair =>
  pair.bidSettlement === 0
    ? {
        ...pair,
        bidSettlement: -pair.bidCap,
        buyOrdersQuantity: pair.buyOrdersQuantity + 1,
        currentSpotPrice: calculateNextSpotPrice({
          orderType: OrderType.Sell,
          spotPrice: pair.baseSpotPrice,
          delta: pair.bondingCurve.delta,
          bondingCurveType: pair.bondingCurve.bondingType,
          counter: pair.mathCounter,
        }),
        mathCounter: pair.mathCounter + 1,
      }
    : pair;

type PatchPairByBondOrders = (props: {
  pair: Pair;
  bondOrders: BondCartOrder[];
  reverse?: boolean;
}) => Pair;
const patchPairByBondOrders: PatchPairByBondOrders = ({
  pair,
  bondOrders,
  reverse,
}) => {
  return reduce(
    bondOrders,
    (pair: Pair, bondOrder: BondCartOrder) =>
      patchPairByBondOrder({ pair, bondOrder, reverse }),
    pair,
  );
};

type PatchPairByBondOrder = (props: {
  pair: Pair;
  bondOrder: BondCartOrder;
  reverse?: boolean;
}) => Pair;
const patchPairByBondOrder: PatchPairByBondOrder = ({
  pair,
  bondOrder,
  reverse = false,
}) => {
  const { orderSize } = bondOrder;

  let orderSizeLeftToAdd = orderSize;
  let patchedPair = { ...pair };

  while (orderSizeLeftToAdd > 0) {
    const currentAmountToAdd = Math.min(
      orderSizeLeftToAdd,
      reverse
        ? patchedPair.bidCap - getCurrentOrderSize(patchedPair)
        : getTopOrderSize(pair),
    );

    patchedPair = patchCurrentOrderInPair({
      pair,
      orderSize: currentAmountToAdd,
      reverse,
    });

    orderSizeLeftToAdd -= currentAmountToAdd;
  }

  return patchedPair;
};

type PatchCurrentOrderInPair = (props: {
  pair: Pair;
  orderSize: number;
  reverse?: boolean;
}) => Pair;
const patchCurrentOrderInPair: PatchCurrentOrderInPair = ({
  pair,
  orderSize, //? Order size should be less or equal to pair's current order size
  reverse = false,
}) => {
  //? Just to make sure
  const patchedPair = reverse
    ? patchPairToNextOrderAfterRemove(pair)
    : patchPairToNextOrderAfterAdd(pair);

  if (!reverse) {
    if (getTopOrderSize(patchedPair) < orderSize)
      throw Error(
        "Order size should be less or equal to pair's current order size",
      );

    const nextPairState = patchPairToNextOrderAfterAdd({
      ...patchedPair,
      edgeSettlement:
        patchedPair.buyOrdersQuantity === 1
          ? patchedPair.edgeSettlement - orderSize
          : patchedPair.edgeSettlement,
      bidSettlement: patchedPair.bidSettlement - orderSize,
    });

    return nextPairState;
  }

  if (patchedPair.bidCap - getTopOrderSize(patchedPair) < orderSize)
    throw Error("Order size should be less or equal to pair's free order size");

  const nextPairState = patchPairToNextOrderAfterRemove({
    ...patchedPair,
    edgeSettlement:
      patchedPair.buyOrdersQuantity === 1
        ? patchedPair.edgeSettlement + orderSize
        : patchedPair.edgeSettlement,
    bidSettlement: patchedPair.bidSettlement + orderSize,
  });

  return nextPairState;
};
