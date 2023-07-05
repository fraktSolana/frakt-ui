import { FC } from 'react';
import moment from 'moment';

import { StatInfo, VALUES_TYPES } from '@frakt/components/StatInfo';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { createTimerJSX } from '@frakt/components/Timer';
import { RefinanceAuctionItem } from '@frakt/api/auctions';
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
  auction: RefinanceAuctionItem;
  hideAuction?: (value: string) => void;
}

const RefinanceAuctionCard: FC<RefinanceAuctionCardProps> = ({
  auction,
  hideAuction,
}) => {
  const { floorPrice, newLoanAmount, interest, currentInterest } =
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
          classNamesProps={{ container: styles.opacity }}
        />
        <StatInfo
          flexType="row"
          label="Next round start"
          value={`Every ${REFINANCE_INTEREST_REFRESH_RATE} sec`}
          valueType={VALUES_TYPES.string}
        />
        <StatInfo
          flexType="row"
          label="New loan amount"
          value={newLoanAmount}
        />
        <StatInfo
          flexType="row"
          label="Interest increase"
          value={`+${REFINANCE_INTEREST_TIC / 100} %`}
          valueType={VALUES_TYPES.string}
        />
        <StatInfo
          flexType="row"
          label="New interest"
          value={`${currentInterest} %`}
          valueType={VALUES_TYPES.string}
        />
        <StatInfo
          flexType="row"
          label="Will end in"
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
        floorPrice={floorPrice}
        lendPrice={newLoanAmount?.toFixed(2)}
        interest={interest}
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
        expiredAt: moment.unix(timeToNextRound + 24 * 60 * 60),
      })}
    </div>
  </div>
);
