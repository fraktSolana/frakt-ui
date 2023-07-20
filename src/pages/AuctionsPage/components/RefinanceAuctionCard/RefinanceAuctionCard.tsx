import { FC } from 'react';
import moment from 'moment';

import { StatInfo, VALUES_TYPES } from '@frakt/components/StatInfo';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { createTimerJSX } from '@frakt/components/Timer';
import { AuctionItem } from '@frakt/api/auctions';
import { Loop, Timer } from '@frakt/icons';

import SuccessRefinanceModal from '../SuccessRefinanceModal';
import AuctionCardBackdrop from '../AuctionCardBackdrop';
import AuctionNFTCardInfo from '../AuctionNFTCardInfo';
import { useRefinanceAuctionCard } from './hooks';
import {
  REFINANCE_INTEREST_REFRESH_RATE,
  REFINANCE_INTEREST_TIC,
  parseRefinanceAuctionsInfo,
} from './helpers';

import styles from './RefinanceAuctionCard.module.scss';

interface RefinanceAuctionCardProps {
  auction: AuctionItem;
  hideAuction?: (value: string) => void;
}

const RefinanceAuctionCard: FC<RefinanceAuctionCardProps> = ({
  auction,
  hideAuction,
}) => {
  const { ticsPassed, floorPrice, newLoanAmount, interest, apy, ltv } =
    parseRefinanceAuctionsInfo(auction);

  const {
    onSubmit,
    loadingModalVisible,
    visibleSuccessRefinanceModal,
    closeRefinanceModal,
  } = useRefinanceAuctionCard(auction, hideAuction);

  return (
    <AuctionCardBackdrop
      onSubmit={onSubmit}
      button={{ text: 'Refinance' }}
      badge={{ text: 'Refinance', icon: Loop }}
    >
      <AuctionNFTCardInfo {...auction} />
      <div className={styles.statsValue}>
        <StatInfo
          flexType="row"
          label="Floor price"
          value={floorPrice}
          decimalPlaces={2}
          classNamesProps={{ container: styles.opacity }}
        />

        <StatInfo
          flexType="row"
          label="Principle"
          value={`${newLoanAmount?.toFixed(2)}◎ (${ltv?.toFixed(0)}% LTV)`}
          valueType={VALUES_TYPES.string}
        />
        <StatInfo
          flexType="row"
          label="Interest"
          decimalPlaces={2}
          value={`${interest?.toFixed(2)}◎  (${apy?.toFixed(0)}% APY)`}
          valueType={VALUES_TYPES.string}
        />
        <StatInfo
          flexType="row"
          label="Interest increase"
          value={`+${REFINANCE_INTEREST_TIC / 100} %`}
          valueType={VALUES_TYPES.string}
        />
        <StatInfo
          flexType="row"
          label="Next interest increase"
          value={`${moment
            .duration(REFINANCE_INTEREST_REFRESH_RATE - ticsPassed, 'seconds')
            .humanize(true)}`}
          valueType={VALUES_TYPES.string}
        />
        <StatInfo
          flexType="row"
          label="Ends in"
          value={createAuctionTimerJSX(
            auction?.bondParams?.auctionRefinanceStartTime,
          )}
          valueType={VALUES_TYPES.string}
        />
      </div>
      <LoadingModal visible={loadingModalVisible} />
      <SuccessRefinanceModal
        open={visibleSuccessRefinanceModal}
        onCancel={() => closeRefinanceModal(auction?.nftMint)}
        nftImage={auction.nftImageUrl}
        floorPrice={floorPrice?.toFixed(2)}
        lendPrice={newLoanAmount?.toFixed(2)}
        interest={interest}
        collectionName={auction?.nftCollectionName}
      />
    </AuctionCardBackdrop>
  );
};

export default RefinanceAuctionCard;

const createAuctionTimerJSX = (timeToNextRound: number): JSX.Element => (
  <div className={styles.timerWrapper}>
    <Timer />
    <div className={styles.countdown}>
      {createTimerJSX({
        expiredAt: moment.unix(timeToNextRound + 12 * 60 * 60),
      })}
    </div>
  </div>
);
