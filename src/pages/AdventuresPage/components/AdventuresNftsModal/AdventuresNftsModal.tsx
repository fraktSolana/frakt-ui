import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Adventure,
  BanxStakeState,
} from 'fbonds-core/lib/fbond-protocol/types';
import classNames from 'classnames';

import { Modal } from '@frakt/components/Modal';
import { CloseModal, TensorFilled } from '@frakt/icons';
import Button from '@frakt/components/Button';
import { AdventureNft, AdventuresInfo } from '@frakt/api/adventures';
import { Tab, Tabs, useTabs } from '@frakt/components/Tabs';
import { showSolscanLinkNotification } from '@frakt/utils/transactions';
import { captureSentryError } from '@frakt/utils/sentry';
import { notify, throwLogsError } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';

import styles from './AdventuresNftsModal.module.scss';
import {
  calcNftsPartnerPoints,
  getAdventureStatus,
  isNftHasActiveSubscriptions,
  isNftStaked,
} from '../../helpers';
import { stakeNfts, unstakeNfts } from '../../transactions';
import { useAdventuresInfoQuery } from '../../hooks';
import { AdventureStatus } from '../../types';

interface AdventuresNftsModalProps {
  isOpen: boolean;
  setIsOpen: (nextValue: boolean) => void;
  adventuresInfo: AdventuresInfo;
}

export const AdventuresNftsModal: FC<AdventuresNftsModalProps> = ({
  isOpen,
  setIsOpen,
  adventuresInfo,
}) => {
  const onCancel = () => setIsOpen(false);

  //? Disable history tab if there aren't ended adventures
  const modalTabs: Tab[] = useMemo(() => {
    const hasStaked = !!adventuresInfo.nfts.find(isNftStaked);

    return [
      {
        label: 'Stake',
        value: 'stake',
      },
      {
        label: 'Unstake',
        value: 'unstake',
        disabled: !hasStaked,
      },
    ];
  }, [adventuresInfo]);

  const {
    tabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: modalTabs,
    defaultValue: modalTabs[0].value,
  });

  const sortedNfts = useMemo(() => {
    return [...(adventuresInfo.nfts || [])]
      ?.sort((a, b) => b.meta.name.localeCompare(a.meta.name))
      ?.sort((a, b) => b.meta.partnerPoints - a.meta.partnerPoints);
  }, [adventuresInfo]);

  return (
    <Modal
      className={styles.modal}
      open={isOpen}
      closable={false}
      onCancel={onCancel}
      footer={false}
      width={768}
      centered
    >
      <div className={styles.closeModalSection}>
        <div className={styles.closeModalIcon} onClick={onCancel}>
          <CloseModal className={styles.closeIcon} />
        </div>
      </div>
      <Tabs
        className={styles.tabs}
        tabs={tabs}
        value={tabValue}
        setValue={setTabValue}
      />
      {tabValue === modalTabs[0].value && (
        <StakeContent
          adventures={adventuresInfo.adventures}
          setIsOpen={setIsOpen}
          nfts={sortedNfts.filter(
            (nft) =>
              !nft?.banxStake ||
              nft?.banxStake?.banxStakeState !== BanxStakeState.Staked,
          )}
        />
      )}
      {tabValue !== modalTabs[0].value && (
        <UnstakeContent
          setIsOpen={setIsOpen}
          nfts={sortedNfts.filter(
            (nft) => nft?.banxStake?.banxStakeState === BanxStakeState.Staked,
          )}
        />
      )}
    </Modal>
  );
};

interface StakeContent {
  nfts: AdventureNft[];
  adventures: Adventure[];
  setIsOpen: (nextValue: boolean) => void;
}
const StakeContent: FC<StakeContent> = ({
  nfts = [],
  setIsOpen,
  adventures = [],
}) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { refetch } = useAdventuresInfoQuery();

  const [selectedNfts, setSelectedNfts] = useState<AdventureNft[]>([]);

  const toggleNft = useCallback(
    (nft) => {
      const isNftSelected = selectedNfts.find(({ mint }) => mint === nft.mint);
      if (isNftSelected) {
        return setSelectedNfts((nfts) =>
          nfts.filter(({ mint }) => mint !== nft.mint),
        );
      }
      setSelectedNfts((nfts) => [...nfts, nft]);
    },
    [selectedNfts],
  );

  const selectAllNfts = useCallback(() => {
    setSelectedNfts(nfts);
  }, [nfts]);

  const deselectAllNfts = useCallback(() => {
    setSelectedNfts([]);
  }, []);

  useEffect(() => {
    return () => setSelectedNfts([]);
  }, []);

  const onStake = async () => {
    try {
      const adventuresToSubscribe = adventures.filter((adventure) => {
        const status = getAdventureStatus(adventure);
        return status === AdventureStatus.UPCOMING;
      });

      await stakeNfts({
        nftMints: selectedNfts.map(({ mint }) => mint),
        adventures: adventuresToSubscribe,
        connection,
        wallet,
        onAfterSend: () => {
          notify({
            message: 'Transactions sent!',
            type: NotifyType.INFO,
          });
        },
        onSuccess: async () => {
          await new Promise((r) => setTimeout(r, 8000));
          notify({
            message: 'Staked successfully!',
            type: NotifyType.SUCCESS,
          });
          refetch();
          setIsOpen(false);
        },
        onError: (error) => {
          throwLogsError(error);

          const isNotConfirmed = showSolscanLinkNotification(error);
          if (!isNotConfirmed) {
            notify({
              message: 'The transaction just failed :( Give it another try',
              type: NotifyType.ERROR,
            });
          }
          captureSentryError({
            error,
            wallet,
            transactionName: 'adventuresStake',
            params: {
              selectedNfts,
            },
          });
        },
      });
    } catch (error) {
      throwLogsError(error);
    }
  };

  return (
    <>
      <div className={styles.content}>
        <ModalStats nfts={nfts} />
        {!!nfts.length && (
          <ul className={styles.nfts}>
            {nfts.map((nft) => (
              <NftCheckbox
                nft={nft}
                key={nft.mint}
                onClick={() => toggleNft(nft)}
                selected={
                  !!selectedNfts.find(
                    (selectedNft) => selectedNft.mint === nft.mint,
                  )
                }
              />
            ))}
          </ul>
        )}
        {!nfts.length && <NoNftsPlaceholder />}
      </div>
      <div className={styles.footer}>
        <Button
          className={styles.footerBtn}
          disabled={!nfts.length}
          onClick={!selectedNfts.length ? selectAllNfts : deselectAllNfts}
        >
          {!selectedNfts.length ? 'Select all' : 'Deselect all'}
        </Button>
        <Button
          type="secondary"
          className={styles.footerBtn}
          disabled={!selectedNfts.length}
          onClick={onStake}
        >
          Stake
        </Button>
      </div>
    </>
  );
};

interface UnstakeContent {
  nfts: AdventureNft[];
  setIsOpen: (nextValue: boolean) => void;
}
const UnstakeContent: FC<UnstakeContent> = ({ nfts = [], setIsOpen }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { refetch } = useAdventuresInfoQuery();

  const [selectedNfts, setSelectedNfts] = useState<AdventureNft[]>([]);

  const toggleNft = useCallback(
    (nft) => {
      const isNftSelected = selectedNfts.find(({ mint }) => mint === nft.mint);
      if (isNftSelected) {
        return setSelectedNfts((nfts) =>
          nfts.filter(({ mint }) => mint !== nft.mint),
        );
      }
      setSelectedNfts((nfts) => [...nfts, nft]);
    },
    [selectedNfts],
  );

  const selectAllNfts = useCallback(() => {
    setSelectedNfts(nfts);
  }, [nfts]);

  const deselectAllNfts = useCallback(() => {
    setSelectedNfts([]);
  }, []);

  useEffect(() => {
    return () => setSelectedNfts([]);
  }, []);

  const onUnstake = async () => {
    try {
      await unstakeNfts({
        nfts: selectedNfts,
        connection,
        wallet,
        onAfterSend: () => {
          notify({
            message: 'Transactions sent!',
            type: NotifyType.INFO,
          });
        },
        onSuccess: async () => {
          await new Promise((r) => setTimeout(r, 8000));
          notify({
            message: 'Unstaked successfully!',
            type: NotifyType.SUCCESS,
          });
          refetch();
          setIsOpen(false);
        },
        onError: (error) => {
          throwLogsError(error);

          const isNotConfirmed = showSolscanLinkNotification(error);
          if (!isNotConfirmed) {
            notify({
              message: 'The transaction just failed :( Give it another try',
              type: NotifyType.ERROR,
            });
          }
          captureSentryError({
            error,
            wallet,
            transactionName: 'adventuresUnstake',
            params: {
              selectedNfts,
            },
          });
        },
      });
    } catch (error) {
      throwLogsError(error);
    }
  };

  return (
    <>
      <div className={styles.content}>
        <ModalStats nfts={nfts} />
        {!!nfts.length && (
          <ul className={styles.nfts}>
            {nfts.map((nft) => (
              <NftCheckbox
                nft={nft}
                key={nft.mint}
                onClick={() => toggleNft(nft)}
                additionalText={
                  isNftHasActiveSubscriptions(nft) ? 'subscribed' : null
                }
                selected={
                  !!selectedNfts.find(
                    (selectedNft) => selectedNft.mint === nft.mint,
                  )
                }
              />
            ))}
          </ul>
        )}
        {!nfts.length && <NoNftsPlaceholder />}
      </div>
      <div className={styles.footer}>
        <Button
          className={styles.footerBtn}
          disabled={!nfts.length}
          onClick={!selectedNfts.length ? selectAllNfts : deselectAllNfts}
        >
          {!selectedNfts.length ? 'Select all' : 'Deselect all'}
        </Button>
        <Button
          type="secondary"
          className={styles.footerBtn}
          disabled={!selectedNfts.length}
          onClick={onUnstake}
        >
          Unstake
        </Button>
      </div>
    </>
  );
};

const NoNftsPlaceholder = () => {
  const TENSOR_LINK = process.env.TENSOR_BANX_MARKET_URL || '/';

  return (
    <div className={styles.noNfts}>
      <p>{`You don't have suitable NFTs or your Banx are listed`}</p>

      <Button type="secondary" className={styles.tensorBtn}>
        <a href={TENSOR_LINK} target="_blank" rel="noopener noreferrer" />
        <TensorFilled />
        Buy banx on tensor
      </Button>
    </div>
  );
};

interface ModalStatsProps {
  nfts: AdventureNft[];
}
const ModalStats: FC<ModalStatsProps> = ({ nfts = [] }) => {
  const walletPartnerPoints = useMemo(
    () => calcNftsPartnerPoints(nfts),
    [nfts],
  );

  return (
    <div className={styles.stats}>
      <div className={styles.statsCol}>
        <p>{nfts.length}</p>
        <p>Banx</p>
      </div>
      <div className={styles.statsCol}>
        <p>{walletPartnerPoints}</p>
        <p>Partner points</p>
      </div>
    </div>
  );
};

interface NftCheckboxProps {
  nft: AdventureNft;
  selected?: boolean;
  additionalText?: string;
  onClick?: () => void;
}

const NftCheckbox: FC<NftCheckboxProps> = ({
  nft,
  selected = false,
  additionalText = '',
  onClick,
}) => {
  return (
    <div
      className={classNames(styles.nft, { [styles.nftPointer]: onClick })}
      onClick={onClick}
    >
      <div className={styles.image}>
        {selected && <div className={styles.selected} />}
        {additionalText && !selected && (
          <div className={styles.additionalText}>{additionalText}</div>
        )}
        <img src={nft.meta.imageUrl} alt={nft.meta.name} />
      </div>

      <p>{nft.meta.partnerPoints} Partner points</p>
    </div>
  );
};
