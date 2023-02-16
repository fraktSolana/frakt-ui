import { useLoadingModal } from '@frakt/components/LoadingModal';
import { PATHS } from '@frakt/constants';
import { useConnection } from '@frakt/hooks';
import { initialTokenListState } from '@frakt/state/stats/reducers';
import { notify } from '@frakt/utils';
import { makeCreatePairTransaction } from '@frakt/utils/bonds';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  changeTradeSettings,
  initializeTradePool,
} from 'fbonds-core/lib/bonds_trade_pool/functions/pool-factory';
import { BondingCurveType } from 'fbonds-core/lib/fbond-protocol/types';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FormValues } from '../types';
import { makeCreateStrategy } from './makeCreateStrategy';

export const useStrategyCreation = () => {
  //1 initializeTradePool
  //2 changeTradeSettings
  // initializeTradePool;
  // changeTradeSettings;
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
    maxTradeAmount: '',
    utilizationRate: '',
    tradeDuration: '',
    tradeAmountRatio: '',
    minTimeBetweenTrades: '',
  });

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
      formValues.tradeAmountRatio &&
      formValues.minTimeBetweenTrades,
  };

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const onCreateOffer = async () => {
    if (wallet.publicKey) {
      try {
        openLoadingModal();

        const { transaction, signers } = await makeCreateStrategy({
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

        notify({
          message: 'Transaction successful!',
          type: NotifyType.SUCCESS,
        });

        // history.push(`${PATHS.BOND}/${marketPubkey}`);
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
    onCreateOffer,
    loadingModalVisible,
    closeLoadingModal,
  };
};
