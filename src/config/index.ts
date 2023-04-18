export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
import { Connection } from '@solana/web3.js';

export const getRightEndpoint = async () => {
  if (IS_DEVELOPMENT) return process.env.DEVELOPMENT_RPC_ENDPOINT;

  const primaryConnection = new Connection(process.env.ADBLOCKED_RPC_ENDPOINT);
  try {
    await primaryConnection.getLatestBlockhash();
    return process.env.ADBLOCKED_RPC_ENDPOINT;
  } catch (err) {
    console.log(
      'helius rpc: ',
      process.env.ADBLOCKED_RPC_ENDPOINT,
      ' is adblocked, using this: ',
      process.env.RPC_ENDPOINT,
    );
    return process.env.RPC_ENDPOINT;
  }
};

export const ENDPOINT = IS_DEVELOPMENT
  ? process.env.DEVELOPMENT_RPC_ENDPOINT
  : process.env.RPC_ENDPOINT;

export const FRKT_TOKEN_MINT_PUBLIC_KEY =
  'ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj';

export const IS_PRIVATE_MARKETS =
  process.env.IS_PRIVATE_MARKETS !== undefined
    ? process.env.IS_PRIVATE_MARKETS
    : false;
