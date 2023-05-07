import { getBestOrdersByBorrowValue } from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import {
  useMarketAndPairs,
  BondOrderParams,
  convertTakenOrderToOrderParams,
} from '@frakt/pages/BorrowPages/cartState';

import {
  makeCreateBondMultiOrdersTransaction,
  pairLoanDurationFilter,
} from '@frakt/utils/bonds';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import {
  showSolscanLinkNotification,
  signAndSendV0TransactionWithLookupTables,
} from '@frakt/utils/transactions';
import { captureSentryError } from '@frakt/utils/sentry';
import { useEffect, useState } from 'react';
import { BorrowNft } from '@frakt/api/nft';

const useConnectedBorrowContent = () => {
  const { wallet } = useWallet();
  const { connection } = useConnection();

  const [currentNft, setCurrentNft] = useState<BorrowNft>(null);

  const [currentBondOrderParams, setCurrentBondOrderParams] =
    useState<BondOrderParams>(null);

  const { market, pairs } = useMarketAndPairs(
    currentNft?.bondParams.marketPubkey,
  );

  useEffect(() => {
    if (market) {
      const { takenOrders } = getBestOrdersByBorrowValue({
        borrowValue: currentNft?.maxLoanValue,
        collectionFloor: market?.oracleFloor?.floor,
        bondOffers: pairs.filter((p) =>
          pairLoanDurationFilter({
            pair: p,
            duration: 7,
          }),
        ),
      });

      const bondOrderParams: BondOrderParams = {
        market,
        orderParams: takenOrders.map((order) => {
          const affectedPair = pairs.find(
            (pair) => pair.publicKey === order.pairPubkey,
          );

          return convertTakenOrderToOrderParams({
            pair: affectedPair,
            takenOrder: order,
          });
        }),
      };

      setCurrentBondOrderParams(bondOrderParams);
    } else {
      setCurrentBondOrderParams(null);
    }
  }, [market, pairs, setCurrentBondOrderParams]);

  const onSubmit = async () => {
    try {
      const result = await borrowSingle({
        mint: currentNft?.mint,
        bondOrderParams: currentBondOrderParams?.orderParams,
        market,
        wallet,
        connection,
      });
      if (!result) {
        throw new Error('Borrow failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    onSubmit,
    setCurrentNft,
  };
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
