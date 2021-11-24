import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { WalletProvider } from './external/contexts/wallet';
import { ConnectionProvider } from './external/contexts/connection';
import { AccountsProvider } from './external/contexts/accounts';
import { URLS } from './constants';

import Page404 from './pages/Page404';
import HomePage from './pages/HomePage';
// import ExchangePage from './pages/ExchangePage';
import VaultsPage from './pages/VaultsPage';
import StakerPage from './pages/StakerPage';
import VaultPage from './pages/VaultPage';
import WalletPage from './pages/WalletPage';
import FraktionalizePage from './pages/FraktionalizePage';
import { ConnectWalletModal } from './components/ConnectWallerModal';
import { UserTokensProvider } from './contexts/userTokens';
import { FraktionProvider } from './contexts/fraktion';
import { SolanaTokenRegistryProvider } from './contexts/solanaTokenRegistry';

export function Routes(): JSX.Element {
  return (
    <Router>
      <ConnectionProvider>
        <WalletProvider>
          <AccountsProvider>
            <SolanaTokenRegistryProvider>
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
                    {/* <Route
                      exact
                      path={URLS.EXCHANGE}
                      component={(): JSX.Element => <ExchangePage />}
                    /> */}
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
                      path={`${URLS.WALLET}/:walletPubkey`}
                      component={(): JSX.Element => <WalletPage />}
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
            </SolanaTokenRegistryProvider>
            <ConnectWalletModal />
          </AccountsProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Router>
  );
}
