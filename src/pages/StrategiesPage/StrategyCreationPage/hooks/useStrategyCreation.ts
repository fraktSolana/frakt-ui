import {
  createTradePools,
  setImageTradePools,
  updateTradePools,
} from '@frakt/api/strategies';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { PATHS } from '@frakt/constants';
import { useConnection } from '@frakt/hooks';
import { notify } from '@frakt/utils';
import { BOND_DECIMAL_DELTA } from '@frakt/utils/bonds';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { BondingCurveType } from 'fbonds-core/lib/fbond-protocol/types';
import { useState } from 'react';

import { useHistory } from 'react-router-dom';
import { useSettingsPool } from '../../hooks/hooks';
import { TradePool } from '../../types';
import { FormValues } from '../types';
import { makeCreateStrategy } from './makeCreateStrategy';
import { makeUpdateStrategy } from './makeUpdateStrategy';

export const useStrategyCreation = (tradePool?: TradePool) => {
  const history = useHistory();
  const wallet = useWallet();
  const connection = useConnection();
  const { clearTradePool } = useSettingsPool();
  console.log(tradePool);

  const [formValues, setFormValues] = useState<FormValues>({
    strategyName: tradePool?.poolName || '',
    image: {
      file: null,
      imageUrl: tradePool?.poolImage || '',
    },
    hadoMarkets: {
      marketName: tradePool?.collections?.[0]?.name || '',
      marketPubkey: tradePool?.settings?.[0]?.hadoMarket || '',
    },
    durationFilter: String(
      tradePool?.settings?.[0]?.durationFilter / 86400 || '7',
    ),
    loanToValueFilter: tradePool?.settings?.[0]?.loanToValueFilter / 100 || 10,
    bondingType:
      tradePool?.settings?.[0]?.bondingType || BondingCurveType.Linear,
    spotPrice: String(
      (BOND_DECIMAL_DELTA - tradePool?.settings?.[0]?.spotPrice) / 100 || '',
    ),
    bidCap: tradePool?.settings?.[0]?.bidCap || '',
    delta: String(tradePool?.settings?.[0]?.delta / 100 || ''),
    utilizationRate: String(
      tradePool?.settings?.[0]?.tradeAmountRatio / 100 || '',
    ),
    maxTradeAmount: String(
      tradePool?.settings?.[0]?.maxTradeAmount / 1e9 || '',
    ),
    tradeDuration: tradePool?.settings?.[0]?.tradeDuration || '',
    remainingSolRatioToFinishTrade: String(
      tradePool?.settings?.[0]?.remainingSolRatioToFinishTrade / 100 || '',
    ),
    minTimeBetweenTrades: String(
      tradePool?.settings?.[0]?.minTimeBetweenTrades || '',
    ),
  });

  const secret = '36LiwBuWy3TvNrl4';

  const setNewTradePools = async (poolPubkey, image) => {
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
      image: image,
      secret,
    });
  };

  const checkDisabled = {
    0: formValues.strategyName && formValues.image.imageUrl,
    1:
      formValues.durationFilter &&
      formValues.loanToValueFilter &&
      formValues.hadoMarkets.marketName,
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
    if (wallet?.publicKey) {
      try {
        openLoadingModal();

        const { transaction, signers, tradePool, tradeSettings } =
          await makeCreateStrategy({
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

        const imagePool = await setImageTradePools(formValues.image.file);

        await setNewTradePools(tradePool, imagePool?.url);

        clearTradePool();

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
    if (wallet?.publicKey) {
      try {
        openLoadingModal();

        const { transaction, signers, tradeSettings } =
          await makeUpdateStrategy({
            connection,
            wallet,
            formValues,
            tradePool: tradePool?.poolPubkey,
          });

        await signAndConfirmTransaction({
          transaction,
          signers,
          wallet,
          connection,
        });

        if (formValues.image.file) {
          const imagePool = await setImageTradePools(formValues.image.file);
          await setUpdateTradePools(tradePool?.poolPubkey, imagePool.url);
        } else {
          await setUpdateTradePools(
            tradePool?.poolPubkey,
            tradePool?.poolImage,
          );
        }

        clearTradePool();

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
