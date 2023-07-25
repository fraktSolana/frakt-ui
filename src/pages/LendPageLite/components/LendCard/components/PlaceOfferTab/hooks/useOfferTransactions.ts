import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { isEmpty } from 'lodash';

import { makeModifyPairTransactions } from '@frakt/utils/bonds/transactions/makeModifyPairTransactions';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { logTxnError, notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { Market, Pair } from '@frakt/api/bonds';

import {
  STANDART_INTEREST_PERCENT,
  makeCreatePairTransaction,
  makeRemoveOrderTransaction,
  useMarketPairs,
} from '@frakt/utils/bonds';

import { LOAN_TO_VALUE_RATIO } from './usePlaceOfferTab';

export const useOfferTransactions = ({
  wallet,
  connection,
  market,
  loanValue,
  durationInDays,
  bondFeature,
  offerSize,
  pair,
  onAfterCreateTransaction,
  goToPlaceOffer,
}: {
  wallet: WalletContextState;
  connection: web3.Connection;
  market: Market;
  loanValue: number;
  durationInDays: number;
  bondFeature: BondFeatures;
  offerSize: number;
  pair: Pair;
  onAfterCreateTransaction: () => void;
  goToPlaceOffer: () => void;
}) => {
  const { hidePair, refetch: refetchMarketPairs } = useMarketPairs({
    marketPubkey: market?.marketPubkey,
  });

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const executeTransaction = async (
    transaction: web3.Transaction,
    signers: web3.Signer[],
    commitment: web3.Commitment,
    onAfterSend: () => void,
    onAfterSuccess: () => void,
  ) => {
    try {
      openLoadingModal();

      await signAndConfirmTransaction({
        transaction,
        signers,
        wallet,
        connection,
        commitment,
        onAfterSend,
      });

      notify({
        message: 'Transaction successful!',
        type: NotifyType.SUCCESS,
      });

      onAfterSuccess?.();
    } catch (error) {
      logTxnError(error);
      notify({
        message: 'The transaction just failed :( Give it another try',
        type: NotifyType.ERROR,
      });
    } finally {
      closeLoadingModal();
    }
  };

  const createTransaction = async ({
    makeTransactionFn,
    transactionParams,
    commitment,
    onAfterSend,
    onAfterSuccess,
  }) => {
    try {
      const { transaction, signers } = await makeTransactionFn({
        ...transactionParams,
        connection,
        wallet,
        onAfterSend,
      });

      await executeTransaction(
        transaction,
        signers,
        commitment,
        onAfterSend,
        onAfterSuccess,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onCreateOffer = async (): Promise<void> => {
    if (!isEmpty(market) && wallet.publicKey) {
      const rawMaxLoanValue = loanValue * (1 + STANDART_INTEREST_PERCENT / 1e2);

      const createTransactionParams = {
        marketPubkey: new web3.PublicKey(market.marketPubkey),
        maxDuration: durationInDays,
        maxLoanValue: rawMaxLoanValue,
        maxLTV: LOAN_TO_VALUE_RATIO,
        solDeposit: offerSize,
        interest: STANDART_INTEREST_PERCENT,
        marketFloor: market.oracleFloor.floor,
        bondFeature,
      };

      await createTransaction({
        makeTransactionFn: makeCreatePairTransaction,
        transactionParams: createTransactionParams,
        commitment: 'confirmed',
        onAfterSend: null,
        onAfterSuccess: () => {
          onAfterCreateTransaction();
          refetchMarketPairs();
        },
      });
    }
  };

  const onEditOffer = async (): Promise<void> => {
    if (!isEmpty(market) && !isEmpty(pair) && wallet.publicKey) {
      const rawMaxLoanValue = loanValue * (1 + STANDART_INTEREST_PERCENT / 1e2);

      const editTransactionParams = {
        solDeposit: offerSize,
        interest: STANDART_INTEREST_PERCENT,
        marketFloor: market.oracleFloor.floor,
        maxLoanValue: rawMaxLoanValue,
        pair,
        maxDuration: durationInDays,
        maxLTV: LOAN_TO_VALUE_RATIO,
      };

      await createTransaction({
        makeTransactionFn: makeModifyPairTransactions,
        transactionParams: editTransactionParams,
        commitment: 'processed',
        onAfterSend: null,
        onAfterSuccess: () => {
          refetchMarketPairs();
        },
      });
    }
  };

  const onRemoveOffer = async (): Promise<void> => {
    if (!isEmpty(market) && !isEmpty(pair) && wallet.publicKey) {
      const removeTransactionParams = {
        bondOfferV2: new web3.PublicKey(pair?.publicKey),
      };

      await createTransaction({
        makeTransactionFn: makeRemoveOrderTransaction,
        transactionParams: removeTransactionParams,
        commitment: 'confirmed',
        onAfterSend: () => hidePair(pair?.publicKey),
        onAfterSuccess: () => {
          refetchMarketPairs();
          goToPlaceOffer();
        },
      });
    }
  };

  return {
    onCreateOffer,
    onEditOffer,
    onRemoveOffer,
    loadingModalVisible,
  };
};
