import { useCallback, useEffect, useState } from 'react';
import { web3 } from 'fbonds-core';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory, useParams } from 'react-router-dom';
import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';
import { useQueryClient } from '@tanstack/react-query';

import { useLoadingModal } from '@frakt/components/LoadingModal';
import {
  getPairAccount,
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
import { Pair } from '@frakt/api/bonds';

import { RBOption } from '../../components/RadioButton';
import { makeModifyPairTransactions } from '@frakt/utils/bonds/transactions/makeModifyPairTransactions';
import { parseMarketOrder } from '../MarketsPage/components/OrderBook/helpers';

export const useOfferPage = () => {
  const history = useHistory();
  const { marketPubkey, pairPubkey } = useParams<{
    marketPubkey: string;
    pairPubkey: string;
  }>();

  const { account } = useNativeAccount();
  const { market, isLoading: marketLoading } = useMarket({
    marketPubkey,
  });

  const { pair, isLoading: pairLoading } = useMarketPair({
    pairPubkey,
  });

  const { refetch: refetchMarketPairs } = useMarketPairs({
    marketPubkey,
  });

  const isEdit = !!pairPubkey;
  const initialPairValues = parseMarketOrder(pair);
  const { hidePair } = useMarketPairs({ marketPubkey: marketPubkey });

  const queryClient = useQueryClient();

  const isLoading = pairPubkey
    ? !initialPairValues?.duration || pairLoading || marketLoading
    : marketLoading;

  const wallet = useWallet();
  const connection = useConnection();

  const [ltv, setLtv] = useState<number>(10);
  const [duration, setDuration] = useState<number>(7);
  const [interest, setInterest] = useState<string>('0');
  const [offerSize, setOfferSize] = useState<string>('0');
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
  }, [isEdit, isLoading, pair]);

  const onLtvChange = useCallback((value: number) => setLtv(value), []);
  const onDurationChange = (nextOption: RBOption<number>) => {
    setDuration(nextOption.value);
  };

  const onInterestChange = (value: string) => setInterest(value);
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

        const { transaction, signers, accountsPublicKeys } =
          await makeCreatePairTransaction({
            marketPubkey: new web3.PublicKey(marketPubkey),
            maxDuration: duration,
            maxLTV: ltv,
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

        await new Promise((r) => setTimeout(r, 10000));

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

        const { transaction, signers, accountsPublicKeys } =
          await makeModifyPairTransactions({
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
        });

        const newPair = await getPairAccount({
          accountsPublicKeys,
          connection,
        });

        newPair &&
          queryClient.setQueryData(
            ['marketPairs', marketPubkey],
            (pairs: Pair[]) => {
              return pairs.map((pair) => {
                if (
                  pair.publicKey === accountsPublicKeys.pairPubkey?.toBase58()
                ) {
                  return newPair;
                }
                return pair;
              });
            },
          );

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

  return {
    loadingModalVisible,
    closeLoadingModal,
    ltv,
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
  };
};
