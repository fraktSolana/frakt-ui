import { FC, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { useWalletModal } from '@frakt/components/WalletModal';
import { Tabs, useTabs, Tab } from '@frakt/components/Tabs';
import BanxImg from '@frakt/assets/BanxUrban.png';
import { Loader } from '@frakt/components/Loader';
import { Button } from '@frakt/components/Button';

import styles from './AdventuresPage.module.scss';
import { AdventuresList } from './components/AdventuresList';
import { AdventuresSidebar } from './components/AdventuresSidebar';
import { useAdventuresInfoQuery } from './hooks';
import { getAdventureStatus } from './helpers';
import { AdventureStatus } from './types';
import { AdventuresNftsModal } from './components/AdventuresNftsModal';

export const AdventuresPage: FC = () => {
  const { adventuresInfo, isLoading } = useAdventuresInfoQuery();

  const walletInfoExists = !!adventuresInfo?.nfts;

  //? Disable history tab if there aren't ended adventures
  const adventuresTabs: Tab[] = useMemo(() => {
    const hasEnded = !!adventuresInfo?.adventures?.find((adventure) => {
      const adventureStatus = getAdventureStatus(adventure);
      return adventureStatus === AdventureStatus.ENDED;
    });

    return [
      {
        label: 'Adventures',
        value: 'adventures',
      },
      {
        label: 'History',
        value: 'history',
        disabled: !hasEnded,
      },
    ];
  }, [adventuresInfo]);

  const {
    tabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: adventuresTabs,
    defaultValue: adventuresTabs[0].value,
  });

  const [nftsModalOpen, setNftsModalOpen] = useState(false);

  return (
    <AppLayout>
      <div
        className={classNames(styles.container, {
          [styles.containerSidebarVisible]: walletInfoExists,
        })}
      >
        <div className={styles.content}>
          <Header />
          {isLoading && <Loader size="large" className={styles.loader} />}

          {!isLoading && (
            <>
              <Tabs
                className={styles.tab}
                tabs={tabs}
                value={tabValue}
                setValue={setTabValue}
              />
              <AdventuresList
                adventuresInfo={adventuresInfo}
                historyMode={tabValue === tabs[1].value}
                setNftsModalOpen={setNftsModalOpen}
              />
            </>
          )}
        </div>
        {walletInfoExists && (
          <>
            <AdventuresSidebar
              adventuresInfo={adventuresInfo}
              setNftsModalOpen={setNftsModalOpen}
            />
          </>
        )}
        {/* //? Check nftModalOpen to rerender modal: to easily reset selectedNfts and selectedTab */}
        {walletInfoExists && nftsModalOpen && (
          <AdventuresNftsModal
            isOpen={nftsModalOpen}
            setIsOpen={setNftsModalOpen}
            adventuresInfo={adventuresInfo}
          />
        )}
      </div>
    </AppLayout>
  );
};

const Header: FC = () => {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <div className={styles.header}>
      <img src={BanxImg} className={styles.headerImg} />
      <div className={styles.headerText}>
        <h1>Banx adventures</h1>
        <p>
          Every week you can send your Banx on Adventures in order to receive
          rewards
        </p>
        {!connected && (
          <Button
            className={styles.headerConnectBtn}
            onClick={() => setVisible(true)}
            type="secondary"
          >
            Connect wallet
          </Button>
        )}
      </div>
    </div>
  );
};
