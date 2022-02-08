import { MARKETS } from '@project-serum/serum';
import { WSOL } from '@raydium-io/raydium-sdk';
import { PublicKey } from '@solana/web3.js';

import { wrapAsyncWithTryCatch } from '../../../utils';
import { registerMarket } from '../../../utils/markets';
import { listMarket } from '../../../utils/serumUtils/send';
import {
  CreateMarketParams,
  WrappedAllTranscationsType,
  WrapperAllTransactionParams,
} from '../fraktion.model';

export const rowCreateMarket = async ({
  fractionsMint,
  tickerName,
  walletPublicKey,
  signAllTransactions,
  connection,
}: CreateMarketParams): Promise<void> => {
  const dexProgramId = MARKETS.find(({ deprecated }) => !deprecated).programId;
  const LOT_SIZE = 0.1;
  const TICK_SIZE = 0.00001;
  const BASE_TOKE_DECIMALS = 3; // FRAKTION DECIMALS
  const QUOTE_TOKEN_DECIMALS = WSOL.decimals; // SOL DECIMALS
  const BASE_LOT_SIZE = Math.round(10 ** BASE_TOKE_DECIMALS * LOT_SIZE);
  const QUOTE_LOT_SIZE = Math.round(
    LOT_SIZE * 10 ** QUOTE_TOKEN_DECIMALS * TICK_SIZE,
  );

  const marketAddress = await listMarket({
    connection,
    walletPublicKey,
    signAllTransactions,
    baseMint: new PublicKey(fractionsMint),
    quoteMint: new PublicKey(WSOL.mint),
    baseLotSize: BASE_LOT_SIZE,
    quoteLotSize: QUOTE_LOT_SIZE,
    dexProgramId,
  });

  await registerMarket(tickerName, marketAddress.toBase58(), fractionsMint);
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rowCreateMarket, {
  onErrorMessage: 'Error listing new market',
});

export const createMarket =
  ({
    walletPublicKey,
    signAllTransactions,
    connection,
  }: WrapperAllTransactionParams) =>
  (
    params: Omit<CreateMarketParams, WrappedAllTranscationsType>,
  ): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      walletPublicKey,
      signAllTransactions,
      ...params,
    });
