import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';
import { isEmpty } from 'lodash';

import { parseMarketOrder } from '@frakt/pages/MarketsPage/components/OrderBook/helpers';
import { useMarket, useMarketPairs } from '@frakt/utils/bonds';
import { useSolanaBalance } from '@frakt/utils/accounts';
import { RBOption } from '@frakt/components/RadioButton';

import { useOfferTransactions } from './useOfferTransactions';
import { useOfferHasChanged } from './useOfferHasChanged';
import { SyntheticParams } from '../../OrderBookLite';
import { DEFAULT_BOND_FEATURE } from '../constants';
import { InitialEditValues } from './../types';
import {
  calculateDefaultLoanValue,
  parseInitialEditValues,
  shouldShowDepositError,
} from './../helpers';

export const usePlaceOfferTab = (
  marketPubkey: string,
  setSyntheticParams: (syntheticParams: SyntheticParams) => void,
  pairPubkey: string,
  setPairPubkey: (pubkey: string) => void,
) => {
  const { connected } = useWallet();
  const { balance: solanaBalance } = useSolanaBalance();

  const { market, isLoading: marketLoading } = useMarket({ marketPubkey });
  const { pairs, isLoading: pairLoading } = useMarketPairs({ marketPubkey });

  const pair = pairs.find((pair) => pair.publicKey === pairPubkey);
  const initialPairValues = parseMarketOrder(pair);

  const isLoading = pairPubkey ? pairLoading || marketLoading : marketLoading;
  const isEdit = !!pairPubkey;

  const [loanValueInput, setLoanValueInput] = useState<string>('0');
  const [loansAmountInput, setLoansAmountInput] = useState<string>('1');
  const [initialEditValues, setInitialEditValues] =
    useState<InitialEditValues>(null);
  const [bondFeature, setBondFeature] =
    useState<BondFeatures>(DEFAULT_BOND_FEATURE);

  const onBondFeatureChange = (nextValue: RBOption<BondFeatures>) => {
    setBondFeature(nextValue.value);
  };

  const onLoanValueChange = (nextValue: string) => {
    setLoanValueInput(nextValue);
  };

  const onLoanAmountChange = (nextValue: string) => {
    setLoansAmountInput(nextValue);
  };

  const onClearFields = () => {
    setBondFeature(DEFAULT_BOND_FEATURE);
    setLoansAmountInput('1');
  };

  const goToPlaceOffer = () => {
    setPairPubkey('');
    onClearFields();
  };

  // Initialization

  //? set best offer value for new offer

  const handleDefaultLoanValue = () => {
    const defaultLoanValue = calculateDefaultLoanValue(
      solanaBalance,
      market.bestOffer,
    );

    setLoanValueInput(defaultLoanValue);
  };

  const handleInitializeFields = () => {
    const { loanAmount, loanValue, bondFeature } = parseInitialEditValues({
      initialPairValues,
      marketFloor: market.oracleFloor?.floor,
    });

    setLoansAmountInput(loanAmount);
    setLoanValueInput(loanValue);
    setBondFeature(bondFeature);
    setInitialEditValues({ loanAmount, loanValue });
  };

  useEffect(() => {
    const hasMarketData = !isEmpty(market) && !isLoading;
    const shouldHandleDefaultLoanValue = !!solanaBalance && !isEdit;

    if (!hasMarketData) return;

    if (shouldHandleDefaultLoanValue) {
      handleDefaultLoanValue();
      return;
    }

    if (isEdit) {
      handleInitializeFields();
    }
  }, [solanaBalance, market, isLoading, pairPubkey]);

  const offerSize = parseFloat(loanValueInput) * parseFloat(loansAmountInput);

  // Update synthetic params
  useEffect(() => {
    const loanValue = parseFloat(loanValueInput);
    const loanAmount = parseFloat(loansAmountInput);
    const offerSizeLamports = offerSize * 1e9 || 0;

    if (loanValue) {
      setSyntheticParams({
        loanValue,
        loanAmount,
        offerSize: offerSizeLamports,
      });
    }
  }, [loanValueInput, loansAmountInput]);

  const { onCreateOffer, onEditOffer, onRemoveOffer, loadingModalVisible } =
    useOfferTransactions({
      loanValue: parseFloat(loanValueInput),
      market,
      bondFeature,
      offerSize,
      pair,
      onAfterCreateTransaction: onClearFields,
      goToPlaceOffer,
    });

  const isOfferHasChanged = useOfferHasChanged(
    initialEditValues,
    isEdit,
    loanValueInput,
    loansAmountInput,
  );

  const showDepositError = shouldShowDepositError(
    initialEditValues,
    solanaBalance,
    offerSize,
  );

  const disableEditOffer = !isOfferHasChanged || showDepositError;
  const disablePlaceOffer = (!offerSize && connected) || showDepositError;

  return {
    isEdit,
    offerSize,
    bondFeature,

    onBondFeatureChange,
    goToPlaceOffer,

    loadingModalVisible,
    showDepositError,
    disablePlaceOffer,
    disableEditOffer,

    onCreateOffer,
    onEditOffer,
    onRemoveOffer,

    loanValueInputParams: {
      onChange: onLoanValueChange,
      value: loanValueInput,
      hasError: showDepositError,
    },

    loanAmountInputParams: {
      onChange: onLoanAmountChange,
      value: loansAmountInput,
    },
  };
};
