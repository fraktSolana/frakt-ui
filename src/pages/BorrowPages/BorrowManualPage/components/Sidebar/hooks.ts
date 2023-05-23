import { useState } from 'react';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';
import { web3 } from 'fbonds-core';

import { PATHS } from '@frakt/constants';
import {
  InstructionsAndSigners,
  showSolscanLinkNotification,
  signAndSendAllTransactions,
  signAndSendV0TransactionWithLookupTables,
} from '@frakt/utils/transactions';
import {
  makeCreateBondMultiOrdersTransaction,
  MAX_ACCOUNTS_IN_FAST_TRACK,
} from '@frakt/utils/bonds';
import { useConnection } from '@frakt/hooks';
import { useBorrow } from '@frakt/pages/BorrowPages/cartState';
import { Market } from '@frakt/api/bonds';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { captureSentryError } from '@frakt/utils/sentry';
import { makeProposeTransaction } from '@frakt/utils/loans';
import { LoanType } from '@frakt/api/loans';
import { BondCartOrder, BorrowNft } from '@frakt/api/nft';
import { useLoadingModalState } from '@frakt/components/LoadingModal';

export const useSidebar = () => {
  const {
    isLoading,
    isBulk,
    totalBorrowValue,
    currentNft,
    onRemoveNft,
    onNextNftSelect,
    currentBondOrderParams,
    market,
    currentLoanType,
    currentLoanValue,
    saveUpcomingOrderToCart,
    clearCart,
    clearCurrentNftState,
  } = useBorrow();

  const [minimizedOnMobile, setMinimizedOnMobile] = useState<boolean>(false);

  const history = useHistory();
  const goToBulkOverviewPage = () => history.push(PATHS.BORROW_BULK_OVERVIEW);
  const goToToBorrowSuccessPage = () => {
    clearCart();
    clearCurrentNftState();
    history.push(PATHS.BORROW_SUCCESS);
  };

  const connection = useConnection();
  const wallet = useWallet();

  const {
    visible: loadingModalVisible,
    setVisible: setLoadingModalVisible,
    clearState: clearLoadingModalState,
  } = useLoadingModalState();

  const onSubmit = async () => {
    if (isBulk) {
      saveUpcomingOrderToCart();
      return goToBulkOverviewPage();
    }

    try {
      setLoadingModalVisible(true);

      const result = await borrowSingle({
        nft: currentNft,
        bondOrderParams: currentBondOrderParams?.orderParams,
        loanType: currentLoanType,
        loanValue: currentLoanValue,
        market,
        wallet,
        connection,
      });
      if (!result) {
        throw new Error('Borrow failed');
      }
      goToToBorrowSuccessPage();
    } catch (error) {
      console.error(error);
    } finally {
      clearLoadingModalState();
    }
  };

  return {
    isLoading: currentNft?.bondParams?.marketPubkey && isLoading,
    isBulk,
    totalBorrowValue,
    currentNft,
    onRemoveNft,
    onNextNftSelect,
    minimizedOnMobile,
    setMinimizedOnMobile,
    onSubmit,
    loadingModalVisible,
    setLoadingModalVisible,
  };
};

type BorrowSingle = (props: {
  nft: BorrowNft;
  bondOrderParams?: BondCartOrder[];
  market?: Market;
  loanType: LoanType;
  loanValue: number;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

const borrowSingle: BorrowSingle = async ({
  nft,
  bondOrderParams,
  loanType,
  loanValue,
  connection,
  wallet,
}) => {
  if (loanType !== LoanType.BOND) {
    const { transaction, signers } = await makeProposeTransaction({
      nftMint: nft.mint,
      valuation: nft.valuation,
      loanValue: loanValue,
      loanType: loanType,
      connection,
      wallet,
    });
    return await signAndSendAllTransactions({
      transactionsAndSigners: [{ transaction, signers }],
      connection,
      wallet,
      commitment: 'confirmed',
      onAfterSend: () => {
        notify({
          message: 'Transaction sent!',
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
        // eslint-disable-next-line no-console
        console.warn(error.logs?.join('\n'));
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
          transactionName: 'borrowSingleClassic',
        });
      },
    });
  }

  const {
    createLookupTableTxn,
    extendLookupTableTxns,
    createAndSellBondsIxsAndSigners,
  } = await makeCreateBondMultiOrdersTransaction({
    nftMint: nft.mint,
    marketPubkey: nft.bondParams.marketPubkey,
    fraktMarketPubkey: nft.bondParams.whitelistEntry.fraktMarket,
    oracleFloorPubkey: nft.bondParams.oracleFloor,
    whitelistEntryPubkey: nft.bondParams.whitelistEntry?.publicKey,
    bondOrderParams: bondOrderParams,
    connection,
    wallet,
  });
  const ableToOptimize =
    createAndSellBondsIxsAndSigners.lookupTablePublicKeys
      .map((lookup) => lookup.addresses)
      .flat().length <= MAX_ACCOUNTS_IN_FAST_TRACK;

  return await signAndSendV0TransactionWithLookupTables({
    createLookupTableTxns: ableToOptimize ? [] : [createLookupTableTxn],
    extendLookupTableTxns: ableToOptimize ? [] : extendLookupTableTxns,
    v0InstructionsAndSigners: ableToOptimize
      ? []
      : [createAndSellBondsIxsAndSigners],
    fastTrackInstructionsAndSigners: ableToOptimize
      ? [createAndSellBondsIxsAndSigners]
      : [],
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
      // eslint-disable-next-line no-console
      console.warn(error.logs?.join('\n'));
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
