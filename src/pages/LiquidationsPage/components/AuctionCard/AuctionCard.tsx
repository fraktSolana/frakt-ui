import { FC } from 'react';
import moment from 'moment';

import { AuctionListItem } from '@frakt/api/raffle';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { createTimerJSX } from '@frakt/components/Timer';
import Button from '@frakt/components/Button';
import { Timer } from '@frakt/icons';

import { GeneralCardInfo, StatsRaffleValues } from '../StatsRaffleValues';
import { useAuctionCard } from './useAuctionCard';
import styles from './AuctionCard.module.scss';

interface AuctionCardProps {
  auction: AuctionListItem;
  hideAuction: (value: string) => void;
}

const AuctionCard: FC<AuctionCardProps> = ({ auction, hideAuction }) => {
  const {
    onSubmit,
    closeLoadingModal,
    loadingModalVisible,
    buyPrice,
    timeToNextRound,
    nextPrice,
  } = useAuctionCard(auction, hideAuction);

  return (
    <>
      <div className={styles.card}>
        <GeneralCardInfo
          nftName={auction.nftName}
          nftImageUrl={auction.nftImageUrl}
          nftCollectionName={auction.nftCollectionName}
        />
        <div className={styles.statsValue}>
          <StatsRaffleValues
            className={styles.opacity}
            label="Floor price"
            value={auction.floorPrice}
          />
          <StatsRaffleValues label="Next round start">
            <div className={styles.wrapper}>
              <Timer />
              <div className={styles.countdown}>
                {createTimerJSX({
                  expiredAt: moment.unix(timeToNextRound),
                  isSecondType: true,
                })}
              </div>
            </div>
          </StatsRaffleValues>
          <StatsRaffleValues label="Next round price" value={nextPrice} />
          <StatsRaffleValues label="Buy price" value={buyPrice} />
        </div>
        <Button onClick={onSubmit} type="secondary" className={styles.button}>
          Liquidate
        </Button>
      </div>
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};

export default AuctionCard;
