//? Comment to trigger vercel env build 6
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { FC } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Router } from '@frakt/router';
import store from '@frakt/state/store';
import { initSentry } from '@frakt/utils/sentry';
import { initAmplitude } from '@frakt/utils/amplitude';
import Confetti from '@frakt/components/Confetti';
import { ErrorBoundary } from '@frakt/components/ErrorBoundary';
import { NotificationModal } from '@frakt/components/NotificationModal';
import { useBestWorkingRPC } from '@frakt/hooks';
import { ENDPOINTS, WALLETS } from '@frakt/config';
import { DialectProvider } from '@frakt/utils/dialect';

initSentry();
initAmplitude();
const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={store}>
          <SolanaConnectionWalletProvider>
            <DialectProvider>
              <Router />
              <Confetti />
              <NotificationModal />
            </DialectProvider>
          </SolanaConnectionWalletProvider>
        </ReduxProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

const SolanaConnectionWalletProvider: FC = ({ children }) => {
  const { endpoint, isLoading } = useBestWorkingRPC({
    endpoints: ENDPOINTS,
    logErrors: true,
  });

  if (isLoading) return <></>;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={WALLETS} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
