import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';

import Badge, { UnverifiedBadge, VerifiedBadge } from '../../components/Badge';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { Loader } from '../../components/Loader';
import { useFraktion } from '../../contexts/fraktion/fraktion.context';
import { VaultState } from '../../contexts/fraktion';
import { shortenAddress } from '../../utils/solanaUtils';
import { InfoTable } from './InfoTable';
import styles from './styles.module.scss';
import { Buyout } from './Buyout';
import { Redeem } from './Redeem';
import { useTokenMap } from '../../contexts/TokenList';
import Trade from './Trade';

export const MOCK_TOKEN_LIST = [
  {
    mint: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    img: 'https://sdk.raydium.io/icons/So11111111111111111111111111111111111111112.png',
    data: 'Some value 1',
  },
  {
    mint: '2kMr32vCwjehHizggK4Gdv7izk7NhTUyLrH7RYvQRFHH',
    symbol: 'FRKT',
    img: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj/logo.png',
    data: 'Some value 1',
  },
];

const VaultPage = (): JSX.Element => {
  const { vaultPubkey } = useParams<{ vaultPubkey: string }>();
  const { loading, vaults, vaultsMarkets } = useFraktion();

  const vaultInfo = useMemo(() => {
    return vaults.find(({ publicKey }) => publicKey === vaultPubkey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaults]);

  const vaultMarket = useMemo(() => {
    return vaultsMarkets.find(
      ({ baseMint }) => baseMint === vaultInfo.fractionMint,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultInfo]);

  const tokenMap = useTokenMap();
  const [tokerName, setTokerName] = useState<string>('');

  useEffect(() => {
    !loading &&
      vaultInfo &&
      setTokerName(tokenMap.get(vaultInfo.fractionMint)?.symbol || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenMap, vaultInfo]);

  return (
    <AppLayout>
      <Container component="main" className={styles.wrapper}>
        {loading && (
          <div className={styles.loading}>
            <Loader size="large" />
          </div>
        )}
        {!loading && !!vaultInfo && (
          <div className={styles.content}>
            <div
              className={styles.image}
              style={{
                backgroundImage: `url(${vaultInfo.imageSrc})`,
              }}
            />
            <div className={styles.details}>
              <div className={styles.detailsHeader}>
                <h2 className={styles.title}>
                  {vaultInfo.name} {tokerName ? `($${tokerName})` : ''}
                </h2>
                <div className={styles.statusAndOwner}>
                  <div className={styles.status}>
                    {vaultInfo.isNftVerified ? (
                      <VerifiedBadge />
                    ) : (
                      <UnverifiedBadge />
                    )}
                    <Badge label={vaultInfo.state} className={styles.badge} />
                  </div>
                  <div className={styles.owner}>
                    {shortenAddress(vaultInfo.authority)}
                  </div>
                </div>
              </div>
              <InfoTable vaultInfo={vaultInfo} />
              {vaultInfo.state === VaultState[1] && (
                <Buyout vaultInfo={vaultInfo} />
              )}
              {vaultInfo.state === VaultState[2] && (
                <Redeem vaultInfo={vaultInfo} />
              )}
              {vaultInfo.state === VaultState[3] && (
                <div className={styles.detailsPlaceholder} />
              )}
              {vaultMarket?.address && (
                <Trade marketAddress={vaultMarket.address} />
              )}
            </div>
          </div>
        )}
      </Container>
    </AppLayout>
  );
};

export default VaultPage;
