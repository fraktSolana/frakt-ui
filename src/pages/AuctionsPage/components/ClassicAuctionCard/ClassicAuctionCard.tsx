import { FC } from 'react';
import moment from 'moment';

import { GeneralCardInfo } from '@frakt/pages/LiquidationsPage/components/StatsRaffleValues';
import { StatInfo, VALUES_TYPES } from '@frakt/components/StatInfo';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { createTimerJSX } from '@frakt/components/Timer';
import { AuctionListItem } from '@frakt/api/raffle';
import { Timer } from '@frakt/icons';

import AuctionCardBackdrop from '../AuctionCardBackdrop';
import { useClassicAuctionCard } from './hooks';
import { parseAuctionsInfo } from './helpers';

import styles from './ClassicAuctionCard.module.scss';

interface ClassicAuctionCardProps {
  auction: AuctionListItem;
  hideAuction: (value: string) => void;
}

const ClassicAuctionCard: FC<ClassicAuctionCardProps> = ({
  auction,
  hideAuction,
}) => {
  const { onSubmit, loadingModalVisible } = useClassicAuctionCard(
    auction,
    hideAuction,
  );

  const { nextPrice, floorPrice, timeToNextRound, buyPrice } =
    parseAuctionsInfo(auction);

  return (
    <AuctionCardBackdrop onSubmit={onSubmit} submitButtonText="Liquidate">
      <GeneralCardInfo {...auction} />
      <div className={styles.statsValue}>
        <StatInfo
          flexType="row"
          label="Floor price"
          value={floorPrice}
          classNamesProps={{ container: styles.opacity }}
        />
        <StatInfo
          flexType="row"
          label="Next round start"
          value={createNextRoundTimerJSX(timeToNextRound)}
          valueType={VALUES_TYPES.string}
        />
        <StatInfo flexType="row" label="Buy price" value={buyPrice} />
        <StatInfo flexType="row" label="Next round price" value={nextPrice} />
      </div>
      <LoadingModal visible={loadingModalVisible} />
    </AuctionCardBackdrop>
  );
};

export default ClassicAuctionCard;

const createNextRoundTimerJSX = (timeToNextRound: number): JSX.Element => (
  <div className={styles.wrapper}>
    <Timer />
    <div className={styles.countdown}>
      {createTimerJSX({
        expiredAt: moment.unix(timeToNextRound),
        isSecondType: true,
      })}
    </div>
  </div>
);
