import { web3, loans } from '@frakt-protocol/frakt-sdk';
import { all, call, takeLatest, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Socket } from 'socket.io-client';

import {
  signAndConfirmTransaction,
  showSolscanLinkNotification,
} from '../../utils/transactions';
import { notify } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import { captureSentryError } from '../../utils/sentry';
import { liquidationsTypes, liquidationsActions } from './actions';
import { WonRaffleListItem } from './types';
import { networkRequest } from '../../utils/state';
import {
  selectConnection,
  selectWallet,
  selectWalletPublicKey,
} from '../common/selectors';
import { selectLotteryTickets } from './selectors';

const wonRafflesChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('won-raffles', (response) => emit(response));
    return () => socket.off('won-raffles');
  });

const lotteryTicketsChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('lottery-tickets', (response) => emit(response));
    return () => socket.off('lottery-tickets');
  });

const fetchGraceListSaga = function* (action) {
  console.log('GRACE LIST PARAM', action.payload);
  yield put(liquidationsActions.fetchGraceListPending());
  try {
    const data = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/liquidation/grace-list`,
    });
    yield put(liquidationsActions.fetchGraceListFulfilled(data));
  } catch (error) {
    yield put(liquidationsActions.fetchGraceListFailed(error));
  }
};

const fetchRaffleListSaga = function* (action) {
  console.log('RAFFLE LIST PARAM', action.payload);
  yield put(liquidationsActions.fetchRaffleListPending());
  try {
    const data = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/liquidation`,
    });
    yield put(liquidationsActions.fetchRaffleListFulfilled(data));
  } catch (error) {
    yield put(liquidationsActions.fetchRaffleListFailed(error));
  }
};

const txRaffleTrySaga = function* (action) {
  const connection = yield select(selectConnection);
  const publicKey = yield select(selectWalletPublicKey);
  const wallet = yield select(selectWallet);
  const lotteryTickets = yield select(selectLotteryTickets);

  const params = {
    connection,
    programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
    admin: new web3.PublicKey(process.env.LOANS_ADMIN_PUBKEY),
    user: publicKey,
    liquidationLot: new web3.PublicKey(action.payload.liquidationLotPubkey),
    attemptsNftMint: new web3.PublicKey(lotteryTickets.attempt),
    sendTxn: async (transaction, signers) => {
      await signAndConfirmTransaction({
        transaction,
        connection,
        wallet,
        signers,
      });
    },
  };
  try {
    const { loanPubkey } = yield call(loans.getLotTicket, params);
    yield put(
      liquidationsActions.txRaffleTryOptimisticResponse(lotteryTickets.attempt),
    );
    console.log(loanPubkey, 'loanPubkey');
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Transaction failed',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({
      error,
      wallet,
      transactionName: 'getLotTicket',
      params,
    });
  }
};

const txLiquidateSaga = function* (action) {
  console.log(action.payload, 'LIQUIDATE');
  yield;
};

const subscribeWonRaffleListSaga = function* (list: WonRaffleListItem[]) {
  yield put(liquidationsActions.setWonRaffleList(list));
};

const subscribeLotteryTicketsSaga = function* (list) {
  yield put(liquidationsActions.setLotteryTicketsList(list));
};

const liquidationsSagas = (socket: Socket) =>
  function* (): Generator {
    const wonRafflesStream: any = yield call(wonRafflesChannel, socket);
    const lotteryTicketsStream: any = yield call(lotteryTicketsChannel, socket);

    yield all([
      takeLatest(liquidationsTypes.FETCH_GRACE_LIST, fetchGraceListSaga),
    ]);
    yield all([
      takeLatest(liquidationsTypes.FETCH_RAFFLE_LIST, fetchRaffleListSaga),
    ]);
    yield all([takeLatest(liquidationsTypes.TX_RAFFLE_TRY, txRaffleTrySaga)]);
    yield all([takeLatest(liquidationsTypes.TX_LIQUIDATE, txLiquidateSaga)]);
    yield all([takeLatest(wonRafflesStream, subscribeWonRaffleListSaga)]);
    yield all([takeLatest(lotteryTicketsStream, subscribeLotteryTicketsSaga)]);
  };

export default liquidationsSagas;
