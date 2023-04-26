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
import {
  DEFAULT_MAX_LOAN_VALUE_FOR_FLOOR_TYPE_OFFER,
  MAX_LOAN_VALUE,
} from './constants';
import { calculateLTV } from './helpers';

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

  const editRepaymentBondFeature =
    isEdit && isAutocompoundBondFeature(autocompoundFeature)
      ? BondFeatures.Autocompound
      : BondFeatures.AutoreceiveSol;

  const editReceiveBondFeature =
    isEdit && isLiquidatedBondFeature(receiveNftFeature)
      ? BondFeatures.None
      : BondFeatures.ReceiveNftOnLiquidation;

  useEffect(() => {
    if (isEdit && !isLoading) {
      const { duration, interest, size, ltv, rawData } = initialPairValues;
      setDuration(duration || 0);
      setInterest((interest * 100)?.toFixed(2));
      setOfferSize((size || 0).toFixed(2));
      setLtv(ltv || 0);
      setAutocompoundFeature(rawData?.bondFeature);
      setReceiveNftFeature(rawData?.bondFeature);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isLoading, pair]);

  useEffect(() => {
    if (!isLoading && !isEmpty(market)) {
      const marketFloor = (market?.oracleFloor?.floor / 1e9 || 0)?.toFixed(2);

      const defaultMaxLoanValue =
        offerType === OfferTypes.FIXED ? marketFloor : '0';

      setMaxLoanValue(defaultMaxLoanValue);
    }
  }, [isLoading, market, offerType]);

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

  const handleInterestOnBlur = (interest: string) => {
    const isDecimalNumber = parseFloat(interest) > 10;

    const interestSliced =
      parseFloat(interest) > 99.5
        ? '99.5'
        : interest.slice(0, isDecimalNumber ? 5 : 4);

    return setInterest(interestSliced);
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
    const isReceitveNftFeature = receiveNftFeature !== BondFeatures.None;
    const isAutocompoundFeature =
      autocompoundFeature === BondFeatures.Autocompound;

    if (isReceitveNftFeature && isAutocompoundFeature)
      return BondFeatures.AutoCompoundAndReceiveNft;

    if (isReceitveNftFeature && !isAutocompoundFeature)
      return BondFeatures.AutoReceiveAndReceiveNft;

    if (isAutocompoundFeature && !isReceitveNftFeature)
      return BondFeatures.Autocompound;

    return BondFeatures.AutoreceiveSol;
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

        const maxLoanValueNumber = parseFloat(maxLoanValue);
        const rawLtv = offerType === OfferTypes.FIXED ? MAX_LOAN_VALUE : ltv;

        const rawMaxLoanValue =
          offerType === OfferTypes.FLOOR && !maxLoanValueNumber
            ? DEFAULT_MAX_LOAN_VALUE_FOR_FLOOR_TYPE_OFFER
            : maxLoanValueNumber;

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

        const { transaction, signers } = await makeModifyPairTransactions({
          solDeposit: parseFloat(offerSize),
          interest: parseFloat(interest),
          marketFloor: market.oracleFloor.floor,
          pair,
          connection,
          maxDuration: duration,
          maxLTV: ltv,
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
          pairPubkey: new web3.PublicKey(pairPubkey),
          authorityAdapter: new web3.PublicKey(pair.authorityAdapterPublicKey),
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
    handleInterestOnBlur,
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
  };
};
