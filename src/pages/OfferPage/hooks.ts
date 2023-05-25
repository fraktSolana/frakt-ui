import { isEmpty } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { web3 } from 'fbonds-core';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory, useParams } from 'react-router-dom';
import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';

import { useLoadingModal } from '@frakt/components/LoadingModal';
import {
  isAutocompoundBondFeature,
  isLiquidatedBondFeature,
  makeCreatePairTransaction,
  makeRemoveOrderTransaction,
  useMarket,
  useMarketPair,
  useMarketPairs,
} from '@frakt/utils/bonds';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { useConnection } from '@frakt/hooks';
import { useNativeAccount } from '@frakt/utils/accounts';
import { PATHS } from '@frakt/constants';

import { RBOption } from '../../components/RadioButton';
import { makeModifyPairTransactions } from '@frakt/utils/bonds/transactions/makeModifyPairTransactions';
import { parseMarketOrder } from '../MarketsPage/components/OrderBook/helpers';
import { OfferTypes } from './types';
import { MAX_LOAN_VALUE } from './constants';
import {
  calculateLTV,
  calculateLtvByOfferType,
  calculateMaxLoanValueByOfferType,
} from './helpers';

export const useOfferPage = () => {
  const history = useHistory();
  const { marketPubkey, pairPubkey } = useParams<{
    marketPubkey: string;
    pairPubkey: string;
  }>();

  const { account } = useNativeAccount();

  const { market, isLoading: marketLoading } = useMarket({ marketPubkey });
  const { pair, isLoading: pairLoading } = useMarketPair({ pairPubkey });
  const { refetch: refetchMarketPairs } = useMarketPairs({ marketPubkey });

  const isEdit = !!pairPubkey;
  const initialPairValues = parseMarketOrder(pair);
  const { hidePair } = useMarketPairs({ marketPubkey: marketPubkey });

  const isLoading = pairPubkey
    ? !initialPairValues?.duration || pairLoading || marketLoading
    : marketLoading;

  const wallet = useWallet();
  const connection = useConnection();

  const [ltv, setLtv] = useState<number>(10);
  const [duration, setDuration] = useState<number>(7);
  const [interest, setInterest] = useState<string>('0');
  const [offerSize, setOfferSize] = useState<string>('0');
  const [offerType, setOfferType] = useState<OfferTypes>(OfferTypes.FIXED);
  const [maxLoanValue, setMaxLoanValue] = useState<string>('0');
  const [receiveNftFeature, setReceiveNftFeature] = useState<BondFeatures>(
    BondFeatures.ReceiveNftOnLiquidation,
  );
  const [autocompoundFeature, setAutocompoundFeature] = useState<BondFeatures>(
    BondFeatures.AutoreceiveSol,
  );

  const [initialEditValues, setInitialEditValues] = useState(null);
  const [isOfferHasChanged, setIsOfferHasChanged] = useState<boolean>(false);

  const editRepaymentBondFeature =
    isEdit && isAutocompoundBondFeature(autocompoundFeature)
      ? BondFeatures.Autocompound
      : BondFeatures.AutoreceiveSol;

  const editReceiveBondFeature =
    isEdit && isLiquidatedBondFeature(receiveNftFeature)
      ? BondFeatures.None
      : BondFeatures.ReceiveNftOnLiquidation;

  useEffect(() => {
    const updateValues = () => {
      const { duration, interest, size, ltv, rawData } = initialPairValues;
      const offerType =
        ltv === MAX_LOAN_VALUE ? OfferTypes.FIXED : OfferTypes.FLOOR;

      const updatedDuration = duration || 0;
      const updatedInterest = (interest * 100)?.toFixed(2);
      const updatedOfferSize = (size || 0).toFixed(2);
      const updatedLtv = ltv || 0;
      const updatedAutocompoundFeature = rawData?.bondFeature;
      const updatedReceiveNftFeature = rawData?.bondFeature;
      const updatedMaxLoanValue = (
        rawData?.maxReturnAmountFilter / 1e9
      )?.toFixed(2);

      setDuration(updatedDuration);
      setInterest(updatedInterest);
      setOfferSize(updatedOfferSize);
      setLtv(updatedLtv);
      setAutocompoundFeature(updatedAutocompoundFeature);
      setReceiveNftFeature(updatedReceiveNftFeature);
      setOfferType(offerType);
      setMaxLoanValue(updatedMaxLoanValue);

      setInitialEditValues({
        ltv: updatedLtv,
        duration: updatedDuration,
        interest: updatedInterest,
        offerSize: updatedOfferSize,
        autocompoundFeature: updatedAutocompoundFeature,
        receiveNftFeature: updatedReceiveNftFeature,
        maxLoanValue: updatedMaxLoanValue,
        offerType,
      });
    };

    if (isEdit && !isLoading) {
      updateValues();
    }
  }, [isEdit, isLoading, pair]);

  useEffect(() => {
    if (!isEmpty(initialEditValues)) {
      const currentValues = {
        ltv,
        duration,
        interest,
        offerSize,
        autocompoundFeature,
        receiveNftFeature,
        maxLoanValue,
        offerType,
      };

      const hasChanged = Object.values(currentValues).some(
        (value, index) => value !== Object.values(initialEditValues)[index],
      );

      setIsOfferHasChanged(hasChanged);
    }
  }, [
    ltv,
    duration,
    interest,
    offerSize,
    autocompoundFeature,
    receiveNftFeature,
    maxLoanValue,
    offerType,
    initialEditValues,
  ]);

  useEffect(() => {
    if (!isLoading && !isEmpty(market) && !isEdit) {
      const marketFloor = (market?.oracleFloor?.floor / 1e9 || 0)?.toFixed(2);

      const defaultMaxLoanValue =
        offerType === OfferTypes.FIXED ? marketFloor : '0';

      setMaxLoanValue(defaultMaxLoanValue);
    }
  }, [isLoading, market, offerType, isEdit]);

  const onLtvChange = useCallback((value: number) => setLtv(value), []);
  const onDurationChange = (nextOption: RBOption<number>) => {
    setDuration(nextOption.value);
  };

  const onMaxLoanValueChange = (value: string) => {
    setMaxLoanValue(value);
  };

  const onInterestChange = (value: string) => {
    setInterest(value);
  };

  const onOfferTypeChange = (value: RBOption<OfferTypes>) => {
    setOfferType(value.value);
  };

  const onOfferSizeChange = (value: string) => {
    setOfferSize(value);
  };

  const onChangeReceiveNftFeature = (nextOption: RBOption<BondFeatures>) => {
    setReceiveNftFeature(nextOption.value);
  };

  const onChangeAutocompoundFeature = (nextOption: RBOption<BondFeatures>) => {
    setAutocompoundFeature(nextOption.value);
  };

  const findNeededBondFeature = () => {
    const isReceiveNftFeature = receiveNftFeature !== BondFeatures.None;
    const isAutocompoundFeature =
      autocompoundFeature === BondFeatures.Autocompound;

    if (isReceiveNftFeature && isAutocompoundFeature) {
      return BondFeatures.AutoCompoundAndReceiveNft;
    } else if (isReceiveNftFeature && !isAutocompoundFeature) {
      return BondFeatures.AutoReceiveAndReceiveNft;
    } else if (isAutocompoundFeature && !isReceiveNftFeature) {
      return BondFeatures.Autocompound;
    } else {
      return BondFeatures.AutoreceiveSol;
    }
  };

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const goBack = () => {
    history.goBack();
  };

  const isValid =
    Number(offerSize) && Number(interest) !== 0 && wallet.connected;

  const onCreateOffer = async () => {
    if (marketPubkey && wallet.publicKey) {
      try {
        openLoadingModal();

        const rawLtv = calculateLtvByOfferType(offerType, ltv);
        const rawMaxLoanValue = calculateMaxLoanValueByOfferType(
          offerType,
          maxLoanValue,
        );

        const { transaction, signers } = await makeCreatePairTransaction({
          marketPubkey: new web3.PublicKey(marketPubkey),
          maxDuration: duration,
          maxLoanValue: rawMaxLoanValue,
          maxLTV: rawLtv,
          solDeposit: parseFloat(offerSize),
          interest: parseFloat(interest),
          marketFloor: market.oracleFloor.floor,
          bondFeature: findNeededBondFeature(),
          connection,
          wallet,
        });

        await signAndConfirmTransaction({
          transaction,
          signers,
          wallet,
          connection,
          commitment: 'confirmed',
        });

        refetchMarketPairs();

        notify({
          message: 'Transaction successful!',
          type: NotifyType.SUCCESS,
        });

        history.push(`${PATHS.BONDS}/${marketPubkey}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error?.logs);
        console.error(error);

        notify({
          message: 'The transaction just failed :( Give it another try',
          type: NotifyType.ERROR,
        });
      } finally {
        closeLoadingModal();
      }
    }
  };

  const onEditOffer = async () => {
    if (marketPubkey && pairPubkey && wallet.publicKey) {
      try {
        openLoadingModal();

        const rawLtv = calculateLtvByOfferType(offerType, ltv);
        const rawMaxLoanValue = calculateMaxLoanValueByOfferType(
          offerType,
          maxLoanValue,
        );

        const { transaction, signers } = await makeModifyPairTransactions({
          solDeposit: parseFloat(offerSize),
          interest: parseFloat(interest),
          marketFloor: market.oracleFloor.floor,
          maxLoanValue: rawMaxLoanValue,
          pair,
          connection,
          maxDuration: duration,
          maxLTV: rawLtv,
          wallet,
        });

        await signAndConfirmTransaction({
          transaction,
          signers,
          wallet,
          connection,
          commitment: 'processed',
        });

        refetchMarketPairs();

        notify({
          message: 'Transaction successful!',
          type: NotifyType.SUCCESS,
        });

        history.push(`${PATHS.BONDS}/${marketPubkey}`);
      } catch (error) {
        console.error(error);

        notify({
          message: 'The transaction just failed :( Give it another try',
          type: NotifyType.ERROR,
        });
      } finally {
        closeLoadingModal();
      }
    }
  };

  const onRemoveOffer = async () => {
    if (marketPubkey && pair && wallet.publicKey) {
      try {
        openLoadingModal();

        const { transaction, signers } = await makeRemoveOrderTransaction({
          bondOfferV2: new web3.PublicKey(pairPubkey),
          wallet,
          connection,
        });

        await signAndConfirmTransaction({
          connection,
          transaction,
          signers,
          wallet,
          onAfterSend: () => hidePair?.(pairPubkey),
        });

        notify({
          message: 'Transaction successful!',
          type: NotifyType.SUCCESS,
        });

        history.push(`${PATHS.BONDS}/${marketPubkey}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error?.logs?.join('\n'));
        console.error(error);

        notify({
          message: 'The transaction just failed :( Give it another try',
          type: NotifyType.ERROR,
        });
      } finally {
        closeLoadingModal();
      }
    }
  };

  const rawLTV = calculateLTV({ market, maxLoanValue, offerType, ltv });

  return {
    loadingModalVisible,
    closeLoadingModal,
    ltv: rawLTV,
    duration,
    offerSize,
    interest,
    onLtvChange,
    onDurationChange,
    onOfferSizeChange,
    onInterestChange,
    onCreateOffer,
    onEditOffer,
    onRemoveOffer,
    isValid,
    isEdit,
    goBack,
    walletSolBalance: account?.lamports ?? 0,
    market,
    isLoading,
    autocompoundFeature: isEdit
      ? editRepaymentBondFeature
      : autocompoundFeature,
    onChangeAutocompoundFeature,
    receiveNftFeature: isEdit ? editReceiveBondFeature : receiveNftFeature,
    onChangeReceiveNftFeature,
    onMaxLoanValueChange,
    maxLoanValue,
    onOfferTypeChange,
    offerType,
    isOfferHasChanged,
  };
};
