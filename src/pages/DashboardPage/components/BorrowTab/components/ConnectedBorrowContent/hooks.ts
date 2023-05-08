import { NFT } from './../../../../types';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

import { makeCreateBondMultiOrdersTransaction } from '@frakt/utils/bonds';
import { fetchMarketPairs, fetchCertainMarket } from '@frakt/api/bonds';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { captureSentryError } from '@frakt/utils/sentry';
import { notify, throwLogsError } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { useConnection } from '@frakt/hooks';

import {
  showSolscanLinkNotification,
  signAndSendV0TransactionWithLookupTables,
} from '@frakt/utils/transactions';

import { filterPairs, getBondOrderParams } from './helpers';

export const useConnectedBorrowContent = () => {
  const wallet = useWallet();
  const connection = useConnection();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const onSubmit = async (nft: NFT) => {
    try {
      openLoadingModal();

      const { market, pairs } = await fetchMarketAndPairs(
        nft?.marketPubkey,
        wallet?.publicKey,
      );

      if (!market) return;

      const bondOrderParams = getBondOrderParams({
        market,
        pairs,
        maxLoanValue: nft?.maxLoanValue,
      });

      const result = await borrowSingle({
        mint: nft?.mint,
        bondOrderParams: bondOrderParams?.orderParams,
        market,
        wallet,
        connection,
      });

      if (!result) {
        throw new Error('Borrow failed');
      }
    } catch (error) {
      console.log(error);
    } finally {
      closeLoadingModal();
    }
  };

  return { onSubmit, loadingModalVisible, closeLoadingModal };
};

const fetchMarketAndPairs = async (
  marketPubkey: string,
  walletPubkey: web3.PublicKey,
) => {
  const marketWeb3Pubkey = new web3.PublicKey(marketPubkey);
  const [pairs, market] = await Promise.all([
    await fetchMarketPairs({ marketPubkey: marketWeb3Pubkey }),
    await fetchCertainMarket({ marketPubkey: marketWeb3Pubkey }),
  ]);

  const filteredPairs = filterPairs(pairs, walletPubkey);

  return { pairs: filteredPairs, market };
};

const borrowSingle = async ({
  mint,
  bondOrderParams,
  market,
  connection,
  wallet,
}) => {
  const {
    createLookupTableTxn,
    extendLookupTableTxns,
    createAndSellBondsIxsAndSigners,
  } = await makeCreateBondMultiOrdersTransaction({
    nftMint: mint,
    market,
    bondOrderParams: bondOrderParams,
    connection,
    wallet,
  });

  return await signAndSendV0TransactionWithLookupTables({
    createLookupTableTxns: [createLookupTableTxn],
    extendLookupTableTxns: extendLookupTableTxns,
    v0InstructionsAndSigners: [createAndSellBondsIxsAndSigners],
    connection,
    wallet,
    commitment: 'confirmed',
    onAfterSend: () => {
      notify({
        message: 'Transactions sent!',
        type: NotifyType.INFO,
      });
    },
    onSuccess: () => {
      notify({
        message: 'Borrowed successfully!',
        type: NotifyType.SUCCESS,
      });
    },
    onError: (error) => {
      throwLogsError(error);
      const isNotConfirmed = showSolscanLinkNotification(error);
      if (!isNotConfirmed) {
        notify({
          message: 'The transaction just failed :( Give it another try',
          type: NotifyType.ERROR,
        });
      }
      captureSentryError({
        error,
        wallet,
        transactionName: 'borrowSingleBond',
      });
    },
  });
};
