import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import classNames from 'classnames/bind';
import { NavLink } from 'react-router-dom';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { Loader } from '../../components/Loader';
import { useFraktion, VaultData, VaultState } from '../../contexts/fraktion';
import { InfoTable } from './InfoTable/InfoTable';
import styles from './styles.module.scss';
import { BuyoutTab } from './BuyoutTab';
import { useTokenMap } from '../../contexts/TokenList';
import { TradeTab } from './TradeTab/TradeTab';
import { SwapTab } from './SwapTab/SwapTab';
import { DetailsHeader } from './DetailsHeader/DetailsHeader';
import { BackToVaultsListButton } from './BackToVaultsListButton';
import { fetchCollectionData } from '../../utils/collections';
import { URLS } from '../../constants';
import { getCollectionThumbnailUrl } from '../../utils';

const VaultPage: FC = () => {
  const [tab, setTab] = useState<tabType>('trade');
  const { vaultPubkey } = useParams<{ vaultPubkey: string }>();
  const { loading, vaults, vaultsMarkets } = useFraktion();
  const [currentCollectionInfo, setCurrentCollectionInfo] = useState<any>();

  const tokenMap = useTokenMap();
  const vaultData: VaultData = useMemo(() => {
    return vaults.find(
      ({ vaultPubkey: publicKey }) => publicKey === vaultPubkey,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaults]);

  const vaultMarket = useMemo(() => {
    return vaultsMarkets.find(
      ({ baseMint }) => baseMint === vaultData.fractionMint,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultData]);

  const [tokerName, setTokerName] = useState<string>('');

  useEffect(() => {
    !loading &&
      vaultData &&
      setTokerName(tokenMap.get(vaultData.fractionMint)?.symbol || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenMap, vaultData]);

  //TODO: Finish for baskets
  const { nftAttributes, nftDescription, nftImage, nftCollectionName } =
    vaultData?.safetyBoxes.length === 1
      ? vaultData.safetyBoxes[0]
      : {
          nftAttributes: null,
          nftDescription: null,
          nftImage: null,
          nftCollectionName: null,
        };

  useEffect(() => {
    (async () => {
      const result = await fetchCollectionData(nftCollectionName);
      if (result) {
        setCurrentCollectionInfo(result);
      }
    })();
  }, [nftCollectionName]);

  //? Set active tab "Buyout" if auction started
  useEffect(() => {
    if (vaultData) {
      const isAuctionStarted = vaultData.auction.auction?.isStarted;
      isAuctionStarted && setTab('buyout');
    }
  }, [vaultData]);

  return (
    <AppLayout>
      <Container component="main" className={styles.wrapper}>
        <BackToVaultsListButton className={styles.goBackBtn} />
        {loading && (
          <div className={styles.loading}>
            <Loader size="large" />
          </div>
        )}
        {!loading && !!vaultData && (
          <div className={styles.content}>
            <div className={styles.col}>
              <div
                className={styles.image}
                style={{
                  backgroundImage: `url(${nftImage})`,
                }}
              />
              <DetailsHeader
                className={styles.detailsHeaderMobile}
                vaultData={vaultData}
                tokerName={tokerName}
              />
              <div className={styles.mainInfoWrapper}>
                {currentCollectionInfo && (
                  <NavLink
                    to={`${URLS.COLLECTION}/${currentCollectionInfo?.collectionName}`}
                    className={styles.collectionLink}
                  >
                    <div
                      className={styles.collectionIcon}
                      style={{
                        backgroundImage: `url(${getCollectionThumbnailUrl(
                          currentCollectionInfo?.thumbnailPath,
                        )})`,
                      }}
                    />
                    <p className={styles.collectionName}>
                      {currentCollectionInfo?.collectionName}
                    </p>
                  </NavLink>
                )}
                {!!nftDescription && (
                  <div className={styles.description}>{nftDescription}</div>
                )}
              </div>

              {!!nftAttributes?.length && (
                <div className={styles.attributesTable}>
                  {nftAttributes.map(({ trait_type, value }, idx) => (
                    <div key={idx} className={styles.attributesTable__row}>
                      <p>{trait_type}</p>
                      <p>{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.details}>
              <DetailsHeader
                className={styles.detailsHeaderDesc}
                vaultData={vaultData}
                tokerName={tokerName}
              />
              <InfoTable
                vaultInfo={vaultData}
                marketId={vaultMarket?.address}
              />
              {/* //? Show tabs if vault active or bought */}
              {(vaultData.state === VaultState.Active ||
                vaultData.state === VaultState.AuctionFinished ||
                vaultData.state === VaultState.AuctionLive) && (
                <>
                  <Tabs tab={tab} setTab={setTab} />
                  <div className={styles.tabContent}>
                    {tab === 'trade' && (
                      <TradeTab
                        vaultInfo={vaultData}
                        tokerName={tokerName}
                        vaultMarketAddress={vaultMarket?.address}
                      />
                    )}
                    {tab === 'swap' && (
                      <SwapTab fractionMint={vaultData.fractionMint} />
                    )}
                    {tab === 'buyout' && <BuyoutTab vaultInfo={vaultData} />}
                  </div>
                </>
              )}
              {vaultData.state === VaultState.Archived && (
                <div className={styles.detailsPlaceholder} />
              )}
            </div>
          </div>
        )}
      </Container>
    </AppLayout>
  );
};

type tabType = 'trade' | 'swap' | 'buyout';

interface TabsProps {
  tab: tabType;
  setTab: (tab: tabType) => void;
}

const Tabs: FC<TabsProps> = ({ tab, setTab }) => {
  return (
    <div className={styles.tabs}>
      <button
        className={classNames([
          styles.tab,
          { [styles.tabActive]: tab === 'trade' },
        ])}
        name="trade"
        onClick={() => setTab('trade')}
      >
        Trade
      </button>
      <button
        className={classNames([
          styles.tab,
          { [styles.tabActive]: tab === 'swap' },
        ])}
        name="swap"
        onClick={() => setTab('swap')}
      >
        Swap
      </button>
      <button
        className={classNames([
          styles.tab,
          { [styles.tabActive]: tab === 'buyout' },
        ])}
        name="buyout"
        onClick={() => setTab('buyout')}
      >
        Buyout
      </button>
    </div>
  );
};

export default VaultPage;
