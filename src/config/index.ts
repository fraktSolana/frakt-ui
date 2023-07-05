import {
  LedgerWalletAdapter,
  SolflareWalletAdapter,
  SlopeWalletAdapter,
  GlowWalletAdapter,
  CoinbaseWalletAdapter,
  TorusWalletAdapter,
  MathWalletAdapter,
  SolletWalletAdapter,
  ExodusWalletAdapter,
  UnsafeBurnerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { SentreWalletAdapter } from '@sentre/connector';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const IS_PRIVATE_MARKETS =
  process.env.IS_PRIVATE_MARKETS !== undefined
    ? process.env.IS_PRIVATE_MARKETS
    : false;

export const IS_TEST_TRANSACTION =
  process.env.IS_TEST_TRANSACTION !== undefined
    ? process.env.IS_TEST_TRANSACTION
    : false;

export const ENDPOINTS = [
  process.env.RPC_LOCALHOST,
  process.env.RPC_HELIOS,
  process.env.RPC_QUICKNODE,
  process.env.RPC_PUBLIC,
].filter(Boolean);

export const WALLETS = [
  new SolflareWalletAdapter(),
  new SlopeWalletAdapter(),
  new GlowWalletAdapter(),
  new LedgerWalletAdapter(),
  new CoinbaseWalletAdapter(),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  new ExodusWalletAdapter(),
  new SentreWalletAdapter(),
  new SolletWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
];

export const FRKT_TOKEN_MINT = process.env.FRKT_TOKEN_MINT;
