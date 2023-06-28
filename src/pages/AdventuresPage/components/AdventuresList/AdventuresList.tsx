import { FC, useMemo } from 'react';
import { capitalize } from 'lodash';
import classNames from 'classnames';
import { useWallet } from '@solana/wallet-adapter-react';
import { Adventure, BanxUser } from 'fbonds-core/lib/fbond-protocol/types';
import { staking } from 'fbonds-core/lib/fbond-protocol/functions';

import { AdventureNft, AdventuresInfo } from '@frakt/api/adventures';

import styles from './AdventuresList.module.scss';
import {
  AdventureStatusLine,
  AdventuresTimer,
  NotParticipatedColumn,
  TotalParticipationColumn,
  WalletParticipationColumn,
  AdventureSubscribeButton,
  AdventuresStats,
} from './components';
import { getAdventureStatus, isNftParticipating } from '../../helpers';
import { AdventureStatus } from '../../types';

interface AdventuresCardProps {
  adventure: Adventure;
  banxUser?: BanxUser;
  nfts?: AdventureNft[];
  walletConnected?: boolean;
  setNftsModalOpen: (nextValue: boolean) => void;
}

const AdventuresCard: FC<AdventuresCardProps> = (props) => {
  const adventureStatus = getAdventureStatus(props.adventure);

  const isEnded = adventureStatus === AdventureStatus.ENDED;

  const isParticipating = useMemo(() => {
    if (props.nfts?.length) {
      return !!props.nfts.find((nft) =>
        isNftParticipating(nft, props.adventure.publicKey),
      );
    }

    return false;
  }, [props.nfts, props.adventure]);

  return (
    <li className={styles.card}>
      <div className={styles.header}>
        <h3
          className={classNames(styles.title, { [styles.titleEnded]: isEnded })}
        >
          Week{' '}
          {staking.helpers.adventureTimestampToWeeks(
            props.adventure.periodStartedAt,
          )}
        </h3>
        <p
          className={classNames(
            styles.status,
            styles[`status__${adventureStatus}`],
          )}
        >
          {capitalize(adventureStatus)}
        </p>
      </div>
      <div className={styles.info}>
        {!isEnded ? (
          <AdventuresTimer {...props} />
        ) : (
          <AdventuresStats {...props} />
        )}

        <div className={styles.stats}>
          <TotalParticipationColumn {...props} />

          {isParticipating && props.walletConnected && (
            <WalletParticipationColumn {...props} />
          )}

          {!isParticipating && props.walletConnected && (
            <NotParticipatedColumn {...props} />
          )}
        </div>

        {props.walletConnected && (
          <div className={styles.statusAndBtnWrapper}>
            <AdventureStatusLine {...props} />
            <AdventureSubscribeButton {...props} />
          </div>
        )}
      </div>
    </li>
  );
};

interface AdventuresListProps {
  adventuresInfo: AdventuresInfo;
  historyMode?: boolean;
  setNftsModalOpen: (nextValue: boolean) => void;
}

export const AdventuresList: FC<AdventuresListProps> = ({
  adventuresInfo,
  historyMode,
  setNftsModalOpen,
}) => {
  const { connected } = useWallet();

  const filteredAdventures = useMemo(
    () =>
      adventuresInfo.adventures.filter((adventure) => {
        const adventureStatus = getAdventureStatus(adventure);
        const isEnded = adventureStatus === AdventureStatus.ENDED;
        return historyMode ? isEnded : !isEnded;
      }),
    [adventuresInfo, historyMode],
  );

  return (
    <ul className={styles.list}>
      {filteredAdventures.map((adventure) => (
        <AdventuresCard
          key={adventure.publicKey}
          adventure={adventure}
          banxUser={adventuresInfo?.banxUser}
          walletConnected={connected}
          nfts={adventuresInfo?.nfts}
          setNftsModalOpen={setNftsModalOpen}
        />
      ))}
    </ul>
  );
};
