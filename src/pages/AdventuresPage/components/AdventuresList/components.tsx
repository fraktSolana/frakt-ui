import { FC, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { find } from 'lodash';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { useCountdown } from '@frakt/hooks';
import { Alert, MoneyBill, Timer, CircleCheck } from '@frakt/icons';
import Button from '@frakt/components/Button';
import { Adventure, BanxUser } from 'fbonds-core/lib/fbond-protocol/types';
import { AdventureNft } from '@frakt/api/adventures';
import { notify, throwLogsError } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { showSolscanLinkNotification } from '@frakt/utils/transactions';
import { captureSentryError } from '@frakt/utils/sentry';

import styles from './AdventuresList.module.scss';
import { useAdventuresInfoQuery } from '../../hooks';
import {
  calcNftsPartnerPoints,
  getAdventureStatus,
  isNftParticipating,
  isNftStaked,
} from '../../helpers';
import { AdventureStatus } from '../../types';
import { subscribeNfts } from '../../transactions';

interface AdventuresComponentsProps {
  adventure: Adventure;
  banxUser?: BanxUser;
  nfts?: AdventureNft[];
  walletConnected?: boolean;
  setNftsModalOpen: (nextValue: boolean) => void;
}

export const AdventureSubscribeButton: FC<AdventuresComponentsProps> = ({
  adventure,
  walletConnected,
  nfts = [],
  setNftsModalOpen,
}) => {
  const adventureStatus = getAdventureStatus(adventure);
  const isUpcoming = adventureStatus === AdventureStatus.UPCOMING;

  const { connection } = useConnection();
  const wallet = useWallet();

  const { refetch } = useAdventuresInfoQuery();

  const stakedNfts = useMemo(() => {
    return nfts.filter(isNftStaked);
  }, [nfts]);

  const subscribedNfts = useMemo(() => {
    return nfts.filter((nft) => isNftParticipating(nft, adventure.publicKey));
  }, [nfts, adventure]);

  const subscribe = useCallback(async () => {
    if (!stakedNfts) return;
    try {
      const subscribedNftsMints = subscribedNfts.map(({ mint }) => mint);

      await subscribeNfts({
        adventure,
        nfts: stakedNfts.filter(
          ({ mint }) => !subscribedNftsMints.includes(mint),
        ),
        connection,
        wallet,
        onAfterSend: () => {
          notify({
            message: 'Transactions sent!',
            type: NotifyType.INFO,
          });
        },
        onSuccess: () => {
          notify({
            message: 'Subscribed successfully!',
            type: NotifyType.SUCCESS,
          });
          refetch();
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
            transactionName: 'adventuresSubscribe',
            params: {
              stakedNfts,
              adventure,
            },
          });
        },
      });
    } catch (error) {
      throwLogsError(error);
    }
  }, [refetch, connection, wallet, adventure, stakedNfts, subscribedNfts]);

  const isParticipating = !!subscribedNfts.length;

  const subscribeUpdateAvailable = useMemo(() => {
    return (
      stakedNfts.length !== subscribedNfts.length &&
      stakedNfts.length &&
      subscribedNfts.length
    );
  }, [stakedNfts, subscribedNfts]);

  if (subscribeUpdateAvailable && isParticipating && isUpcoming)
    return (
      <Button
        type="secondary"
        className={styles.subscribeBtn}
        onClick={subscribe}
      >
        Update subscription with new Banx
      </Button>
    );

  if (isUpcoming && walletConnected && !isParticipating)
    return (
      <Button
        type="secondary"
        className={styles.subscribeBtn}
        onClick={stakedNfts.length ? subscribe : () => setNftsModalOpen(true)}
      >
        Subscribe to participate
      </Button>
    );

  return <></>;
};

export const AdventureStatusLine: FC<AdventuresComponentsProps> = ({
  adventure,
  nfts = [],
}) => {
  enum Status {
    PARTICIPATING = 'Participating',
    SUBSCRIBED = 'Subscribed',
    REWARDED = 'Rewared',
    NOT_REWARDED = 'Not rewarded',
    DEFAULT = '',
  }

  const isRewarded = useMemo(() => {
    if (nfts.length) {
      const subscribedNfts = nfts.filter((nft) =>
        isNftParticipating(nft, adventure.publicKey),
      );

      return !!find(
        subscribedNfts,
        (nft) => nft?.banxStake?.farmedAmount !== 0,
      );
    }

    return false;
  }, [adventure, nfts]);

  const status = useMemo(() => {
    const adventureStatus = getAdventureStatus(adventure);

    const isParticipating = (() => {
      if (nfts?.length) {
        return !!nfts.find((nft) =>
          isNftParticipating(nft, adventure.publicKey),
        );
      }
      return false;
    })();

    const isLive = adventureStatus === AdventureStatus.LIVE;
    const isUpcoming = adventureStatus === AdventureStatus.UPCOMING;
    const isEnded = adventureStatus === AdventureStatus.ENDED;

    if (isParticipating && isLive) return Status.PARTICIPATING;
    if (isParticipating && isUpcoming) return Status.SUBSCRIBED;
    if (isEnded && isRewarded) return Status.REWARDED;
    if (isEnded && !isRewarded) return Status.NOT_REWARDED;
    return Status.DEFAULT;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nfts]);

  const TEXT_BY_STATUS = {
    [Status.PARTICIPATING]: 'Participating',
    [Status.SUBSCRIBED]: 'Subscribed',
    [Status.REWARDED]: 'Rewarded',
    [Status.NOT_REWARDED]:
      'Not rewarded... Next time, make sure you have Banx and they are not listed',
    [Status.DEFAULT]: '',
  };

  const ICON_BY_STATUS = {
    [Status.PARTICIPATING]: <Timer className={styles.statusLineIconTimer} />,
    [Status.SUBSCRIBED]: <CircleCheck />,
    [Status.REWARDED]: <MoneyBill />,
    [Status.NOT_REWARDED]: null,
    [Status.DEFAULT]: null,
  };

  return TEXT_BY_STATUS[status] ? (
    <div className={styles.statusLine}>
      {ICON_BY_STATUS[status] && (
        <div className={styles.statusLineIcon}>{ICON_BY_STATUS[status]}</div>
      )}
      <p>{TEXT_BY_STATUS[status]}</p>
    </div>
  ) : (
    <></>
  );
};

export const NotParticipatedColumn: FC<AdventuresComponentsProps> = ({
  adventure,
}) => {
  const TEXT_BY_STATUS = {
    [AdventureStatus.ENDED]: "You didn't participate",
    [AdventureStatus.LIVE]: 'You are not subscribed',
    DEFAULT: 'You are currently not subscribed',
  };

  const adventureStatus = getAdventureStatus(adventure);

  return (
    <div className={classNames(styles.statsCol, styles.statsColWarn)}>
      <Alert />
      <p>{TEXT_BY_STATUS[adventureStatus] || TEXT_BY_STATUS.DEFAULT}</p>
    </div>
  );
};

export const WalletParticipationColumn: FC<AdventuresComponentsProps> = ({
  adventure,
  nfts = [],
}) => {
  const TITLE_BY_STATUS = {
    [AdventureStatus.ENDED]: 'You participated with',
    [AdventureStatus.LIVE]: 'You are participating with',
    DEFAULT: 'You subscribed with',
  };

  const adventureStatus = getAdventureStatus(adventure);

  const { nftsAmount, points } = useMemo(() => {
    if (nfts.length) {
      const subscribedNfts = nfts.filter((nft) =>
        isNftParticipating(nft, adventure.publicKey),
      );

      const nftsAmount = subscribedNfts.length;
      const points = calcNftsPartnerPoints(subscribedNfts);

      return { nftsAmount, points };
    }

    return { nftsAmount: 0, points: 0 };
  }, [nfts, adventure]);

  return (
    <div className={styles.statsCol}>
      <h5>{TITLE_BY_STATUS[adventureStatus] || TITLE_BY_STATUS.DEFAULT}</h5>
      <p>{nftsAmount} Banx</p>
      <p>{points} Partner points</p>
    </div>
  );
};

export const TotalParticipationColumn: FC<AdventuresComponentsProps> = ({
  adventure,
}) => {
  const TITLE_BY_STATUS = {
    [AdventureStatus.ENDED]: 'Total participation',
    DEFAULT: 'Total participating',
  };

  const adventureStatus = getAdventureStatus(adventure);

  return (
    <div className={styles.statsCol}>
      <h5>{TITLE_BY_STATUS[adventureStatus] || TITLE_BY_STATUS.DEFAULT}</h5>
      <p>{adventure.totalBanxSubscribed} Banx</p>
      <p>{adventure.totalPartnerPoints} Partner points</p>
    </div>
  );
};

export const AdventuresTimer: FC<AdventuresComponentsProps> = ({
  adventure,
}) => {
  const TIMER_TEXT_BY_STATUS = {
    [AdventureStatus.LIVE]: 'Before rewards distribution',
    [AdventureStatus.UPCOMING]: 'Deadline to subscribe',
    DEFAULT: '',
  };

  const adventureStatus = getAdventureStatus(adventure);

  const isLive = adventureStatus === AdventureStatus.LIVE;

  const { timeLeft } = useCountdown(
    isLive ? adventure.periodEndingAt : adventure.periodStartedAt,
  );

  return (
    <div className={styles.timerWrapper}>
      <div className={styles.timerIcon}>
        {isLive ? <MoneyBill /> : <Timer className={styles.timerSvg} />}
      </div>
      <div>
        <span className={styles.timer}>
          {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m
        </span>
        <p className={styles.timerText}>
          {TIMER_TEXT_BY_STATUS[adventureStatus] ||
            TIMER_TEXT_BY_STATUS.DEFAULT}
        </p>
      </div>
    </div>
  );
};

export const AdventuresStats: FC<AdventuresComponentsProps> = ({
  // adventure,
  walletConnected,
}) => {
  //TODO: Calc this values
  const totalRevenue = 10 * 1e9;
  const receivedRevenue = 5 * 1e9;
  const userReceivedRevenue = 0;

  // const { totalRevenue, receivedRevenue } = adventure.totalStats;
  // const userReceivedRevenue = adventure?.userStats?.receivedRevenue || 0;

  const otherReceivedRevenue = receivedRevenue - userReceivedRevenue;

  const unclaimedRevenue = totalRevenue - receivedRevenue;

  const userPercent = (userReceivedRevenue / totalRevenue) * 100;
  const unclaimedPercent = (unclaimedRevenue / totalRevenue) * 100;

  return (
    <div className={styles.statsChartWrapper}>
      <div className={styles.statsChartTotalWrapper}>
        <span>{(totalRevenue / 1e9).toFixed(1)}◎</span>
        <span>Total revenue</span>
        <div
          className={styles.chart}
          style={{
            background: `linear-gradient(90deg, #34c759 0%, #34c759 ${userPercent}%, rgba(31,174,255,1) ${userPercent}%, rgba(31,174,255,1) ${
              100 - unclaimedPercent
            }%, rgba(255,192,31,1) ${
              100 - unclaimedPercent
            }%, rgba(255,192,31,1) 100%)`,
          }}
        />
      </div>
      <div className={styles.statsChartOtherWrapper}>
        {walletConnected && (
          <div className={styles.statsChartOther}>
            <span className={styles.dotGreen}>You received:</span>
            <span>{(userReceivedRevenue / 1e9).toFixed(1)}◎</span>
          </div>
        )}
        <div className={styles.statsChartOther}>
          <span className={styles.dotBlue}>Other received:</span>
          <span>{(otherReceivedRevenue / 1e9).toFixed(1)}◎</span>
        </div>
        <div className={styles.statsChartOther}>
          <span className={styles.dotYellow}>Unclaimed</span>
          <span>{(unclaimedRevenue / 1e9).toFixed(1)}◎</span>
        </div>
      </div>
    </div>
  );
};
