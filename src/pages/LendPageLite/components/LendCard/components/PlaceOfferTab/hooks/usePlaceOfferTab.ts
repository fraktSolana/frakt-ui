import { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';
import { isEmpty } from 'lodash';

import { parseMarketOrder } from '@frakt/pages/MarketsPage/components/OrderBook/helpers';
import { SyntheticParams } from '@frakt/pages/MarketsPage/components/OrderBook/types';
import { useMarket, useMarketPair } from '@frakt/utils/bonds';
import { useSolanaBalance } from '@frakt/utils/accounts';
import { RBOption } from '@frakt/components/RadioButton';

import { useOfferTransactions } from './useOfferTransactions';
import { useNumericInput } from '../../NumericInput';
import { calculateLoanValue } from './../helpers';

export const OFFER_INTEREST_PERCENTAGE = 3;
export const LOAN_TO_VALUE_RATIO = 100;
export const DURATION_IN_DAYS = 7;

export const usePlaceOfferTab = (
  marketPubkey: string,
  setSyntheticParams: (syntheticParams: SyntheticParams) => void,
  pairPubkey: string,
  setPairPubkey: (pubkey: string) => void,
) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const { balance: solanaBalance } = useSolanaBalance();

  const { market, isLoading: marketLoading } = useMarket({ marketPubkey });
  const { pair, isLoading: pairLoading } = useMarketPair({ pairPubkey });
  const initialPairValues = parseMarketOrder(pair);

  const isLoading = pairPubkey
    ? !initialPairValues?.duration || pairLoading || marketLoading
    : marketLoading;

  const isEdit = !!pairPubkey;

  const goToPlaceOffer = () => {
    setPairPubkey('');
    onClearFields();
  };

  const loanValueInput = useNumericInput('Loan value', '');
  const loansAmountInput = useNumericInput('Loans amount', '');

  const [bondFeature, setBondFeature] = useState<BondFeatures>(
    BondFeatures.AutoReceiveAndReceiveNft,
  );

  const [initialEditValues, setInitialEditValues] = useState(null);
  const [isOfferHasChanged, setIsOfferHasChanged] = useState<boolean>(false);

  // Event handlers

  const onBondFeatureChange = (nextValue: RBOption<BondFeatures>) => {
    setBondFeature(nextValue.value);
  };

  const onClearFields = () => {
    setBondFeature(BondFeatures.AutoReceiveAndReceiveNft);
    loanValueInput.onChange('');
    loansAmountInput.onChange('');
  };

  // Initialization

  useEffect(() => {
    if (isEdit && !isLoading) {
      initializeFields();
    }
  }, [isEdit, isLoading, pair]);

  const initializeFields = () => {
    const { rawData } = initialPairValues;

    const marketFloor = market?.oracleFloor?.floor;
    const loanValue = calculateLoanValue(initialPairValues, marketFloor);
    const loanAmount = Math.round(rawData.fundsSolOrTokenBalance / loanValue);

    const updatedLoanValue = (loanValue / 1e9)?.toFixed(2);

    loansAmountInput.onChange(loanAmount?.toFixed(0));
    loanValueInput.onChange(updatedLoanValue);

    setBondFeature(rawData?.bondFeature);

    setInitialEditValues({
      loanAmount: loanAmount?.toFixed(0),
      loanValue: updatedLoanValue,
    });
  };

  // Calculation

  const calculateOfferSize = () => {
    const { value: loanValue } = loanValueInput;
    const { value: loansAmount } = loansAmountInput;
    return parseFloat(loanValue) * parseFloat(loansAmount);
  };

  const offerSize = calculateOfferSize();

  const showDepositError = solanaBalance < offerSize;

  // Update synthetic params

  useEffect(() => {
    setSyntheticParams({
      ltv: LOAN_TO_VALUE_RATIO,
      loanValue: parseFloat(loanValueInput.value),
      loanAmount: parseFloat(loansAmountInput.value),
      offerSize: offerSize * 1e9 || 0,
      interest: 0,
    });
  }, [offerSize, loansAmountInput.value, loanValueInput.value]);

  useEffect(() => {
    if (!isEmpty(initialEditValues) && isEdit) {
      const currentValues = {
        loanAmount: loansAmountInput.value,
        loanValue: loanValueInput.value,
      };

      const hasChanged = Object.values(currentValues).some(
        (value, index) => value !== Object.values(initialEditValues)[index],
      );

      setIsOfferHasChanged(hasChanged);
    }
  }, [loanValueInput.value, loansAmountInput.value]);

  const { onCreateOffer, onEditOffer, onRemoveOffer, loadingModalVisible } =
    useOfferTransactions({
      wallet,
      connection,
      loanValue: parseFloat(loanValueInput.value),
      market,
      durationInDays: DURATION_IN_DAYS,
      bondFeature,
      offerSize,
      pair,
      onAfterCreateTransaction: onClearFields,
      goToPlaceOffer,
    });

  const disableEditOffer = !isOfferHasChanged;
  const disablePlaceOffer = !offerSize && wallet?.connected;

  return {
    isEdit,
    bondFeature,
    onBondFeatureChange,
    loanValueInput,
    loansAmountInput,
    offerSize,
    onCreateOffer,
    onEditOffer,
    onRemoveOffer,
    loadingModalVisible,
    goToPlaceOffer,
    onClearFields,
    showDepositError,
    disablePlaceOffer,
    disableEditOffer,
  };
};
