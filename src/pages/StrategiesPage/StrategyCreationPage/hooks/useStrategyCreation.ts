import { createTradePools, updateTradePools } from '@frakt/api/strategies';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { PATHS } from '@frakt/constants';
import { useConnection } from '@frakt/hooks';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { useWallet } from '@solana/wallet-adapter-react';
import { BondingCurveType } from 'fbonds-core/lib/fbond-protocol/types';
import { useState } from 'react';

import { useHistory } from 'react-router-dom';
import { FormValues } from '../types';
import { makeCreateStrategy } from './makeCreateStrategy';
import { makeUpdateStrategy } from './makeUpdateStrategy';

export const useStrategyCreation = () => {
  const history = useHistory();

  const wallet = useWallet();

  const connection = useConnection();

  ///reserveFundsRatio = utilizationRate

  const [formValues, setFormValues] = useState<FormValues>({
    strategyName: '',
    imageUrl: '',
    selectedMarket: {
      marketName: '',
      marketPubkey: '',
    },
    duration: '7',
    maxLTV: 10,
    bondingCurve: BondingCurveType.Linear,
    spotPrice: '',
    bidCap: '',
    delta: '',
    utilizationRate: '',
    maxTradeAmount: '',
    tradeDuration: '',
    remainingSolRatioToFinishTrade: '',
    minTimeBetweenTrades: '',
  });

  const secret = '36LiwBuWy3TvNrl4';

  const setNewTradePools = async (tradePoolPubkey) => {
    await createTradePools({
      tradePoolPubkey,
      name: formValues.strategyName,
      imageUrl: formValues.imageUrl,
      secret,
    });
  };

  const setUpdateTradePools = async (tradePoolPubkey) => {
    await updateTradePools({
      tradePoolPubkey,
      name: formValues.strategyName,
      imageUrl: formValues.imageUrl,
      secret,
    });
  };

  const checkDisabled = {
    0: formValues.strategyName && formValues.imageUrl,
    1: formValues.duration && formValues.maxLTV,
    2:
      formValues.bondingCurve &&
      formValues.spotPrice &&
      formValues.bidCap &&
      formValues.delta,
    3:
      formValues.maxTradeAmount &&
      formValues.utilizationRate &&
      formValues.tradeDuration &&
      formValues.remainingSolRatioToFinishTrade &&
      formValues.minTimeBetweenTrades,
  };

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const onCreateStrategy = async () => {
    if (wallet?.publicKey?.toBase58()) {
      try {
        openLoadingModal();

        const { transaction, signers, tradePool } = await makeCreateStrategy({
          connection,
          wallet,
          formValues,
        });

        await signAndConfirmTransaction({
          transaction,
          signers,
          wallet,
          connection,
        });

        setNewTradePools(tradePool);

        notify({
          message: 'Transaction successful!',
          type: NotifyType.SUCCESS,
        });

        history.push(`${PATHS.MY_STRATEGIES}`);
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

  const onUpdateStrategy = async () => {
    if (wallet?.publicKey?.toBase58()) {
      try {
        openLoadingModal();

        const tradePool = 'tradePool';

        const { transaction, signers } = await makeUpdateStrategy({
          connection,
          wallet,
          formValues,
          tradePool,
        });

        await signAndConfirmTransaction({
          transaction,
          signers,
          wallet,
          connection,
        });

        setUpdateTradePools(tradePool);

        notify({
          message: 'Transaction successful!',
          type: NotifyType.SUCCESS,
        });

        history.push(`${PATHS.MY_STRATEGIES}`);
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

  return {
    formValues,
    setFormValues,
    checkDisabled,
    onCreateStrategy,
    onUpdateStrategy,
    loadingModalVisible,
    closeLoadingModal,
  };
};
