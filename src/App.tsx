//? Comment to trigger vercel env build 7
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SlopeWalletAdapter,
  GlowWalletAdapter,
  CoinbaseWalletAdapter,
  TorusWalletAdapter,
  MathWalletAdapter,
  SolletWalletAdapter,
  ExodusWalletAdapter,
  BackpackWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { SentreWalletAdapter } from '@sentre/connector';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { FC, useEffect, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Router } from '@frakt/router';
import store from '@frakt/state/store';
import { getRightEndpoint } from '@frakt/config';
import { initSentry } from '@frakt/utils/sentry';
import { initAmplitude } from '@frakt/utils/amplitude';
import Confetti from '@frakt/components/Confetti';
import { ErrorBoundary } from '@frakt/components/ErrorBoundary';
import { NotificationModal } from '@frakt/components/NotificationModal';

initSentry();
initAmplitude();

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new SlopeWalletAdapter(),
  new GlowWalletAdapter(),
  new LedgerWalletAdapter(),
  new CoinbaseWalletAdapter(),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  new ExodusWalletAdapter(),
  new SentreWalletAdapter(),
  new BackpackWalletAdapter(),
  new SolletWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
];

const queryClient = new QueryClient();

const App: FC = () => {
  const [endpoint, setEndpoint] = useState<string>(null);

  useEffect(() => {
    (async () => {
      const endpoint = await getRightEndpoint();
      setEndpoint(endpoint);
    })();
  }, []);

  if (!endpoint) return <></>;

  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <QueryClientProvider client={queryClient}>
              <Router />
              <Confetti />
              <NotificationModal />
            </QueryClientProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
};

export default App;
