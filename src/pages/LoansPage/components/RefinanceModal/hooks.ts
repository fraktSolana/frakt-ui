import { useState, useEffect, useMemo } from 'react';
import {
  getBestOrdersByBorrowValue,
  getBestOrdersForExit,
  getBestOrdersForRefinance,
} from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import { sumBy, get } from 'lodash';

import {
  convertTakenOrdersToOrderParams,
  patchPairWithProtocolFee,
} from '@frakt/pages/BorrowPages/cartState';
import { BASE_POINTS, useMarket, useMarketPairs } from '@frakt/utils/bonds';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { commonActions } from '@frakt/state/common/actions';
import { refinanceLoan } from '@frakt/utils/loans';
import { throwLogsError } from '@frakt/utils';
import { useConnection } from '@frakt/hooks';
import { Loan } from '@frakt/api/loans';

export const useLoanTransactions = ({ loan }: { loan: Loan }) => {
  const wallet = useWallet();
  const connection = useConnection();
  const dispatch = useDispatch();

  const showConfetti = (): void => {
    dispatch(commonActions.setConfetti({ isVisible: true }));
  };

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const [isRefinanceModalVisible, setRefinanceModalVisible] =
    useState<boolean>(false);

  const { market, pairs } = useLoanData(loan);

  const [bestOrders, setBestOrders] = useState(null);

  useEffect(() => {
    if (!pairs.length) return;

    const loanToValueBasePoints =
      (loan.loanValue / (market?.oracleFloor?.floor ?? 0)) * BASE_POINTS;

    console.log(loan.repayValue);
    const bestOrdersForRefinance = getBestOrdersByBorrowValue({
      bondOffers: pairs,
      collectionFloor: market?.oracleFloor?.floor,
      borrowValue: loan.repayValue,
    });

    setBestOrders(bestOrdersForRefinance);
  }, [pairs, loan, market]);

  const onRefinance = async (): Promise<void> => {
    try {
      openLoadingModal();
      console.log('BEST ORDERS FOR REFINANCE', bestOrders);
      const result = await refinanceLoan({
        wallet,
        connection,
        loan,
        market,
        bondOrderParams: convertTakenOrdersToOrderParams({
          pairs,
          takenOrders: bestOrders?.takenOrders || [],
        }),
      });

      if (!result) {
        throw new Error('Refinance failed');
      }
      showConfetti();
    } catch (error) {
      throwLogsError(error);
    } finally {
      closeLoadingModal();
      setRefinanceModalVisible(false);
    }
  };

  const borrowed = get(bestOrders, 'maxBorrowValue', 0);
  // const debt = sumBy(
  //   bestOrders?.takenOrders,
  //   ({ pricePerShare, orderSize }) => (orderSize / pricePerShare) * BASE_POINTS,
  // );
  const fee = bestOrders?.takenOrders.reduce(
    (feeSum, orderParam) =>
      feeSum + orderParam.orderSize * (BASE_POINTS - orderParam.pricePerShare),
    0,
  );
  const debt = (borrowed + fee) / BASE_POINTS;
  return {
    onRefinance,
    isRefinanceModalVisible,
    loadingModalVisible,
    bestLoanParams: { borrowed, debt },
    openRefinanceModal: () => setRefinanceModalVisible(true),
    closeRefinanceModal: (event: Event) => {
      setRefinanceModalVisible(false);
      event.stopPropagation();
    },
  };
};

const useLoanData = (loan: Loan) => {
  const marketPubkey = loan?.bondParams?.marketPubkey;

  const { market } = useMarket({ marketPubkey });

  const { pairs: rawPairs, isLoading: isLoadingPairs } = useMarketPairs({
    marketPubkey,
  });

  const pairs = useMemo(() => {
    return isLoadingPairs ? [] : rawPairs.map(patchPairWithProtocolFee);
  }, [isLoadingPairs]);

  return {
    market,
    pairs,
    isLoadingPairs,
  };
};
