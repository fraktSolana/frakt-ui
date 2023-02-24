import {
  createTradePools,
  setImageTradePools,
  updateTradePools,
} from '@frakt/api/strategies';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { PATHS } from '@frakt/constants';
import { useConnection } from '@frakt/hooks';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
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
    image: {
      file: null,
      imageUrl: '',
    },
    hadoMarkets: {
      marketName: '',
      marketPubkey: '',
    },
    durationFilter: '7',
    loanToValueFilter: 10,
    bondingType: BondingCurveType.Linear,
    spotPrice: '',
    bidCap: '',
    delta: '',
    utilizationRate: '',
    maxTradeAmount: '',
    tradeDuration: '',
    remainingSolRatioToFinishTrade: '',
    minTimeBetweenTrades: '',
  });

  console.log(formValues);

  const secret = '36LiwBuWy3TvNrl4';

  const setNewTradePools = async (poolPubkey, image) => {
    console.log({
      poolPubkey: new PublicKey(poolPubkey).toBase58(),
      name: formValues.strategyName,
      image,
      secret,
    });
    await createTradePools({
      poolPubkey: new PublicKey(poolPubkey).toBase58(),
      name: formValues.strategyName,
      image,
      secret,
    });
  };

  const setUpdateTradePools = async (poolPubkey, image) => {
    await updateTradePools({
      poolPubkey: new PublicKey(poolPubkey).toBase58(),
      name: formValues.strategyName,
      image,
      secret,
    });
  };

  const checkDisabled = {
    0: formValues.strategyName && formValues.image.imageUrl,
    1: formValues.durationFilter && formValues.loanToValueFilter,
    2:
      formValues.bondingType &&
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

        const { transaction, signers, tradePool, tradeSettings } =
          await makeCreateStrategy({
            connection,
            wallet,
            formValues,
          });

        console.log('tradePool', tradePool);
        console.log('tradeSettings', tradeSettings);

        await signAndConfirmTransaction({
          transaction,
          signers,
          wallet,
          connection,
        });

        // const imagePool = await setImageTradePools({
        //   image: formValues.image.file,
        // });

        const imagePool =
          'https://live.staticflickr.com/65535/52708390090_d8f3a22bbc_z.jpg';

        await setNewTradePools(tradePool, imagePool);

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

        const imageUrl = await setImageTradePools({
          image: formValues.image.file,
        });

        setUpdateTradePools(tradePool, imageUrl);

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
