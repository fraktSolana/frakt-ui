import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  getLedgerWallet,
  getPhantomWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
} from '@solana/wallet-adapter-wallets';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';

import { URLS } from './constants';
import Page404 from './pages/Page404';
import HomePage from './pages/HomePage';
import ExchangePage from './pages/ExchangePage';
import VaultsPage from './pages/VaultsPage';
import StakerPage from './pages/StakerPage';
import VaultPage from './pages/VaultPage';
import FraktionalizePage from './pages/FraktionalizePage';
// import { ConnectWalletModal } from './components/ConnectWallerModal';
import { UserTokensProvider } from './contexts/userTokens';
import { FraktionProvider } from './contexts/fraktion';
import TokenListContextProvider from './contexts/TokenList';
import { ENDPOINT, NETWORK } from './config';
import { WalletModalProvider } from './contexts/WalletModal';

const wallets = [
  getPhantomWallet(),
  getSolflareWallet(),
  getLedgerWallet(),
  getSolletWallet({ network: NETWORK as WalletAdapterNetwork }),
  getSolletExtensionWallet({ network: NETWORK as WalletAdapterNetwork }),
];

export const Routes = (): JSX.Element => {
  return (
    <Router>
      <ConnectionProvider endpoint={ENDPOINT}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <TokenListContextProvider>
              <UserTokensProvider>
                <FraktionProvider>
                  <Switch>
                    <Route
                      exact
                      path={URLS.ROOT}
                      component={(): JSX.Element => <HomePage />}
                    />
                    <Route
                      exact
                      path={URLS.VAULTS}
                      component={(): JSX.Element => <VaultsPage />}
                    />
                    <Route
                      exact
                      path={`${URLS.VAULT}/:vaultPubkey`}
                      component={(): JSX.Element => <VaultPage />}
                    />
                    <Route
                      exact
                      path={URLS.EXCHANGE}
                      component={(): JSX.Element => <ExchangePage />}
                    />
                    <Route
                      exact
                      path={URLS.STAKER_PAGE}
                      component={(): JSX.Element => <StakerPage />}
                    />
                    <Route
                      exact
                      path={URLS.FRAKTIONALIZE}
                      component={(): JSX.Element => <FraktionalizePage />}
                    />
                    <Route
                      exact
                      path={URLS.PAGE_404}
                      component={(): JSX.Element => <Page404 />}
                    />
                    <Route
                      exact
                      path={'*'}
                      component={(): JSX.Element => <Page404 />}
                    />
                  </Switch>
                </FraktionProvider>
              </UserTokensProvider>
            </TokenListContextProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Router>
  );
};
