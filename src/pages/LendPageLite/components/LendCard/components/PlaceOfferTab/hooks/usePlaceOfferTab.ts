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
import { calculateLoanValue } from './../helpers';

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

  const [loanValueInput, setLoanValueInput] = useState<string>('0');
  const [loansAmountInput, setLoansAmountInput] = useState<string>('0');

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
    setLoanValueInput('0');
    setLoansAmountInput('0');
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
    const loanAmount = (
      rawData.fundsSolOrTokenBalance / loanValue || 0
    )?.toFixed(0);

    const updatedLoanValue = (loanValue / 1e9)?.toFixed(2);

    setLoansAmountInput(loanAmount);
    setLoanValueInput(updatedLoanValue);

    setBondFeature(rawData?.bondFeature);

    setInitialEditValues({
      loanAmount,
      loanValue: updatedLoanValue,
    });
  };

  const offerSize = parseFloat(loanValueInput) * parseFloat(loansAmountInput);

  const showDepositError = solanaBalance < offerSize;

  // Update synthetic params

  useEffect(() => {
    setSyntheticParams({
      ltv: LOAN_TO_VALUE_RATIO,
      loanValue: parseFloat(loanValueInput),
      loanAmount: parseFloat(loansAmountInput),
      offerSize: offerSize * 1e9 || 0,
      interest: 0,
    });
  }, [offerSize, loansAmountInput, loanValueInput]);

  useEffect(() => {
    if (!isEmpty(initialEditValues) && isEdit) {
      const currentValues = {
        loanAmount: loansAmountInput,
        loanValue: loanValueInput,
      };

      const hasChanged = Object.values(currentValues).some(
        (value, index) => value !== Object.values(initialEditValues)[index],
      );

      setIsOfferHasChanged(hasChanged);
    }
  }, [loanValueInput, loansAmountInput]);

  const { onCreateOffer, onEditOffer, onRemoveOffer, loadingModalVisible } =
    useOfferTransactions({
      wallet,
      connection,
      loanValue: parseFloat(loanValueInput),
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
    setLoanValueInput,
    setLoansAmountInput,
  };
};
