import { create } from 'zustand';
import produce from 'immer';
import { reduce, groupBy, map } from 'lodash';

import { Pair } from '@frakt/api/bonds';
import { BondCartOrder } from '@frakt/api/nft';
import { LoanType } from '@frakt/api/loans';

import { CartOrder } from './types';
import { calculateNextSpotPrice } from 'fbonds-core/lib/fbond-protocol/helpers';
import { OrderType } from 'fbonds-core/lib/fbond-protocol/types';
import {
  getTopOrderSize,
  getCurrentOrderSize,
} from 'fbonds-core/lib/fbond-protocol/utils/cartManager';

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
  removeOrder2: (props: { nftMint: string }) => void;
  findPair: (props: { pairPubkey: string }) => Pair | null;
  findOrder: (props: { nftMint: string }) => CartOrder | null;
  clearCart: () => void;
  // addOrder: (props: {
  //   loanType: LoanType;
  //   loanValue: number;
  //   nft: BorrowNft;
  //   pair?: Pair;
  //   market?: Market;
  //   unshift?: boolean;
  // }) => void;
  // addBondOrder: (props: { bondOrder: CartOrder; pairs: Pair[] }) => void;
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
  removeOrder2({ nftMint }) {
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

        const patchedPairs = affectedPairs; //TODO call patchPairByBondOrders but in reverse direction
        //   const patchedPairs = map(pairs, (pair) =>
        //   patchPairByBondOrders({
        //     pair,
        //     bondOrders: bondOrdersByPair[pair.publicKey],
        //     reverse,
        //   }),
        // );

        patchedPairs.forEach((patchedPair) => {
          const indexOfPairInState = state.pairs.findIndex(
            ({ publicKey }) => publicKey === patchedPair.publicKey,
          );

          state.pairs[indexOfPairInState] = patchedPair;
        });
      }),
    );
  },
  removeOrder: ({ nftMint }) => {
    set(
      produce((state: CartState) => {
        const order = state.orders.find(
          ({ borrowNft }) => borrowNft.mint === nftMint,
        );

        if (order.loanType === LoanType.BOND) {
          for (const orderParam of order.bondOrderParams?.orderParams) {
            let amount_of_bonds_left = orderParam.orderSize;
            const indexOfPairInState = state.pairs.findIndex(
              ({ publicKey }) => publicKey === orderParam.pairPubkey,
            );
            let patchedPair = patchPairToNextOrderAfterBuy(
              state.pairs[indexOfPairInState],
            );
            while (amount_of_bonds_left) {
              const amountToRemove = Math.min(
                amount_of_bonds_left,
                patchedPair.bidCap - getTopOrderSize(patchedPair),
              );
              amount_of_bonds_left -= amountToRemove;
              patchedPair = patchPairToNextOrderAfterBuy({
                ...patchedPair,
                edgeSettlement:
                  patchedPair.buyOrdersQuantity === 1
                    ? patchedPair.edgeSettlement + amountToRemove
                    : patchedPair.edgeSettlement,
                bidSettlement: patchedPair.bidSettlement + amountToRemove,
              });
            }

            state.pairs[indexOfPairInState] = patchedPair;
          }
        }

        state.orders = state.orders.filter(
          ({ borrowNft }) => borrowNft.mint !== nftMint,
        );
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
  // addOrder: ({ loanType, nft, loanValue, pair, market, unshift = false }) => {
  //   if (loanType !== LoanType.BOND) {
  //     return set(
  //       produce((state: CartState) => {
  //         const order = convertBorrowNftToOrder({
  //           nft,
  //           loanType,
  //           loanValue,
  //         });

  //         unshift ? state.orders.unshift(order) : state.orders.push(order);
  //       }),
  //     );
  //   }
  //   const patchedPair: Pair = patchPairToNextOrderAfterSell(pair);

  //   const bondsAmount = calcBondsAmount({
  //     loanValue,
  //     spotPrice: pair.currentSpotPrice,
  //   });

  //   set(
  //     produce((state: CartState) => {
  //       const orderInState = state.orders.find(
  //         ({ borrowNft }) => borrowNft.mint === nft.mint,
  //       );

  //       if (!orderInState) {
  //         state.orders.push(
  //           convertBorrowNftToOrder({
  //             nft,
  //             loanType,
  //             loanValue,
  //             bondOrderParams: {
  //               market,
  //               orderParams: [
  //                 {
  //                   orderSize: bondsAmount,
  //                   spotPrice: patchedPair.currentSpotPrice,
  //                   pairPubkey: patchedPair.publicKey,
  //                   assetReceiver: patchedPair.assetReceiver,
  //                   durationFilter: patchedPair.validation.durationFilter,
  //                   bondFeature: patchedPair.validation.bondFeatures,
  //                 },
  //               ],
  //             },
  //           }),
  //         );
  //       } else {
  //         orderInState.bondOrderParams.orderParams.push({
  //           orderSize: bondsAmount,
  //           spotPrice: patchedPair.currentSpotPrice,
  //           pairPubkey: patchedPair.publicKey,
  //           assetReceiver: patchedPair.assetReceiver,
  //           durationFilter: patchedPair.validation.durationFilter,
  //           bondFeature: patchedPair.validation.bondFeatures,
  //         });
  //       }

  //       const indexOfPairInState = state.pairs.findIndex(
  //         ({ publicKey }) => publicKey === patchedPair.publicKey,
  //       );
  //       const nextPairState: Pair = patchPairToNextOrderAfterSell({
  //         ...patchedPair,
  //         edgeSettlement:
  //           patchedPair.buyOrdersQuantity === 1
  //             ? patchedPair.edgeSettlement - bondsAmount
  //             : patchedPair.edgeSettlement,
  //         bidSettlement: patchedPair.bidSettlement - bondsAmount,
  //       });
  //       if (indexOfPairInState === -1) {
  //         state.pairs.push(nextPairState);
  //       } else {
  //         state.pairs[indexOfPairInState] = nextPairState;
  //       }
  //     }),
  //   );
  // },
  // addBondOrder: ({ bondOrder, pairs }) => {
  //   const { addOrder, findPair } = get();

  //   for (const orderParam of bondOrder.bondOrderParams.orderParams) {
  //     let amount_left_to_add = orderParam.orderSize;
  //     while (amount_left_to_add > 0) {
  //       const pair = patchPairToNextOrderAfterSell(
  //         findPair({ pairPubkey: orderParam.pairPubkey }) ||
  //           pairs.find((pair) => pair.publicKey === orderParam.pairPubkey),
  //       );

  //       const currentAmountToAdd = Math.min(
  //         amount_left_to_add,
  //         getTopOrderSize(pair),
  //       );
  //       amount_left_to_add -= currentAmountToAdd;
  //       const currentLoanValue = currentAmountToAdd * pair.currentSpotPrice;
  //       addOrder({
  //         loanType: LoanType.BOND,
  //         loanValue: currentLoanValue,
  //         nft: bondOrder.borrowNft,
  //         pair: pair,
  //         market: bondOrder.bondOrderParams.market,
  //         unshift: false,
  //       });
  //     }
  //   }
  // },
}));

type CalcBondsAmount = (props: {
  loanValue: number;
  spotPrice: number;
}) => number;
export const calcBondsAmount: CalcBondsAmount = ({ loanValue, spotPrice }) => {
  loanValue;
  spotPrice;
  // return 0;
  return Math.trunc(loanValue / spotPrice);
};

const patchPairToNextOrderAfterSell = (pair: Pair): Pair =>
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

const patchPairToNextOrderAfterBuy = (pair: Pair): Pair =>
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

//! ADD BOND ORDER LOGIC
//? 1. chunk by pair: [[5, 10], [10, 200, 5]]
//? 2. loop chunk patch(pair, [5, 100, 5000]) --> patchedPair[]
//? 3. push pairs to state
//? 3.1 pair already in state --> replace
//? 3.2 new pair --> push
//? 4. push order

//! REMOVE BOND ORDER LOGIC
//? 1. Get affected pairs by order
//? 2. Chunk bondOrders by pairPubkey: [[5, 10], [10, 200, 5]]
//? 3. loop chunk patchReverse(pair, [5, 100, 5000]) --> patchedPairs[]
//? 4. push pairs to state
//? 4.1 pair already in state --> replace
//? 4.2 new pair --> push
//? 5. Push order

type PatchPairByBondOrders = (props: {
  pair: Pair;
  bondOrders: BondCartOrder[];
}) => Pair;
const patchPairByBondOrders: PatchPairByBondOrders = ({ pair, bondOrders }) => {
  return reduce(
    bondOrders,
    (pair: Pair, bondOrder: BondCartOrder) =>
      patchPairByBondOrder({ pair, bondOrder }),
    pair,
  );
};

type PatchPairByBondOrder = (props: {
  pair: Pair;
  bondOrder: BondCartOrder;
}) => Pair;
const patchPairByBondOrder: PatchPairByBondOrder = ({ pair, bondOrder }) => {
  const { orderSize } = bondOrder;

  let orderSizeLeftToAdd = orderSize;
  let patchedPair = { ...pair };

  while (orderSizeLeftToAdd > 0) {
    const currentAmountToAdd = Math.min(
      orderSizeLeftToAdd,
      getTopOrderSize(pair),
    );

    patchedPair = patchCurrentOrderInPair({
      pair,
      orderSize: currentAmountToAdd,
    });

    orderSizeLeftToAdd -= currentAmountToAdd;
  }

  return patchedPair;
};

type PatchCurrentOrderInPair = (props: {
  pair: Pair;
  orderSize: number;
}) => Pair;
const patchCurrentOrderInPair: PatchCurrentOrderInPair = ({
  pair,
  orderSize, //? Order size should be less or equal to pair's current order size
}) => {
  //? Just to make sure
  const patchedPair = patchPairToNextOrderAfterSell(pair);

  if (getCurrentOrderSize(patchedPair) < orderSize)
    throw Error(
      "Order size should be less or equal to pair's current order size",
    );

  const nextPairState = patchPairToNextOrderAfterSell({
    ...patchedPair,
    edgeSettlement:
      patchedPair.buyOrdersQuantity === 1
        ? patchedPair.edgeSettlement - orderSize
        : patchedPair.edgeSettlement,
    bidSettlement: patchedPair.bidSettlement - orderSize,
  });

  return nextPairState;
};
