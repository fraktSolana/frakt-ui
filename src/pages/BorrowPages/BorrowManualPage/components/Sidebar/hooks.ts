import { useState } from 'react';
import {
  useWallet,
  WalletContextState,
  useConnection,
} from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';
import { web3 } from 'fbonds-core';
import {
  borrow,
  borrowCnft,
} from 'fbonds-core/lib/fbond-protocol/functions/bond/creation';

import { PATHS } from '@frakt/constants';
import {
  showSolscanLinkNotification,
  signAndSendAllTransactions,
} from '@frakt/utils/transactions';
import { useBorrow } from '@frakt/pages/BorrowPages/cartState';
import { Market } from '@frakt/api/bonds';
import { logTxnError, notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { captureSentryTxnError } from '@frakt/utils/sentry';
import { makeProposeTransaction } from '@frakt/utils/loans';
import { LoanType } from '@frakt/api/loans';
import { BondCartOrder, BorrowNft } from '@frakt/api/nft';
import { useLoadingModalState } from '@frakt/components/LoadingModal';
import { IS_TEST_TRANSACTION } from '@frakt/config';
import { getAssetProof } from 'fbonds-core/lib/fbond-protocol/helpers';

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

  const { connection } = useConnection();
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
        logTxnError(error);
        const isNotConfirmed = showSolscanLinkNotification(error);

        if (!isNotConfirmed) {
          notify({
            message: 'The transaction just failed :( Give it another try',
            type: NotifyType.ERROR,
          });
        }

        captureSentryTxnError({
          error,
          walletPubkey: wallet?.publicKey.toBase58(),
          transactionName: 'borrowSingleClassic',
        });
      },
    });
  }

  const order = {
    borrowNft: nft,
    bondOrderParams: bondOrderParams.filter(
      (orderParam) => orderParam.orderSize > 0,
    ),
  };

  if (nft.cnftParams) {
    const proof = await getAssetProof(
      nft.mint,
      'https://rpc.helius.xyz/?api-key=6bad2ffe-d003-11ed-afa1-0242ac120002',
    );
    await borrowCnft({
      isTest: IS_TEST_TRANSACTION,

      notBondTxns: [],
      orders: [order],
      connection,
      wallet,
      isLedger: false,
      skipPreflight: false,
      cnftParams: {
        dataHash: nft.cnftParams.dataHash,
        creatorHash: nft.cnftParams.creatorHash,
        leafId: nft.cnftParams.leafId,
        proof,
      },
      treePubkey: nft.bondParams.whitelistEntry.whitelistedAddress,
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
        logTxnError(error);
        const isNotConfirmed = showSolscanLinkNotification(error);
        if (!isNotConfirmed) {
          notify({
            message: 'The transaction just failed :( Give it another try',
            type: NotifyType.ERROR,
          });
        }
        captureSentryTxnError({
          error,
          walletPubkey: wallet?.publicKey.toBase58(),
          transactionName: 'borrowSingleBond',
        });
      },
    });
  } else {
    await borrow({
      isTest: IS_TEST_TRANSACTION,

      notBondTxns: [],
      orders: [order],
      connection,
      wallet,
      isLedger: false,
      skipPreflight: false,

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
        logTxnError(error);
        const isNotConfirmed = showSolscanLinkNotification(error);
        if (!isNotConfirmed) {
          notify({
            message: 'The transaction just failed :( Give it another try',
            type: NotifyType.ERROR,
          });
        }
        captureSentryTxnError({
          error,
          walletPubkey: wallet?.publicKey.toBase58(),
          transactionName: 'borrowSingleBond',
        });
      },
    });
  }
};
