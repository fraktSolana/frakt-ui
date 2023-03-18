import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NavLink, useParams } from 'react-router-dom';
import { web3 } from 'fbonds-core';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { useMarket, useWalletBonds } from '@frakt/utils/bonds';
import { useBondsTransactions } from '@frakt/hooks/useBondTransactions';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { Loader } from '@frakt/components/Loader';
import { PATHS } from '@frakt/constants';
import { Arrow } from '@frakt/icons';

import OrderBook from '../MarketsPage/components/OrderBook/OrderBook';
import { MarketInfo } from './components/MarketInfo';
import { BondsList } from './components/BondsList';
import styles from './MarketPage.module.scss';

export const MarketPage: FC = () => {
  const wallet = useWallet();

  const { marketPubkey } = useParams<{ marketPubkey: string }>();

  const { market, isLoading: marketLoading } = useMarket({
    marketPubkey,
  });

  const {
    bonds,
    isLoading: bondsLoanding,
    hideBond,
  } = useWalletBonds({
    walletPubkey: wallet.publicKey,
    marketPubkey: new web3.PublicKey(marketPubkey),
  });

  const loading = marketLoading || (wallet.connected && bondsLoanding);

  const { onClaimAll } = useBondsTransactions({
    bonds,
    hideBond,
    market,
  });

  return (
    <AppLayout>
      {loading && <Loader size="large" />}
      {!loading && (
        <div className={styles.bondPage}>
          <div className={styles.wrapper}>
            <NavLink to={PATHS.BONDS} className={styles.btnBack}>
              <Arrow />
            </NavLink>

            <MarketInfo market={market} bonds={bonds} onClaimAll={onClaimAll} />
          </div>
          <BondsList bonds={bonds} hideBond={hideBond} />
          {!wallet.connected && (
            <ConnectWalletSection text="Connect your wallet to see your bonds" />
          )}
          <OrderBook market={market} />
        </div>
      )}
    </AppLayout>
  );
};
