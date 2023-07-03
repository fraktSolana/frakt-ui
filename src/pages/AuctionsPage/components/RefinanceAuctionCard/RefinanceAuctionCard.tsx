import { FC } from 'react';

import { StatInfo, VALUES_TYPES } from '@frakt/components/StatInfo';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { RefinanceAuctionItem } from '@frakt/api/auctions';

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

const BADGE_COLOR = '#821FFF';

const RefinanceAuctionCard: FC<RefinanceAuctionCardProps> = ({
  auction,
  hideAuction,
}) => {
  const { floorPrice, currentLoanAmount, newLoanAmount } =
    parseRefinanceAuctionsInfo(auction);

  const { onSubmit, loadingModalVisible } = useRefinanceAuctionCard(
    auction,
    hideAuction,
  );

  return (
    <AuctionCardBackdrop
      onSubmit={onSubmit}
      button={{ text: 'Refinance' }}
      badge={{ text: 'Loan refinancing', color: BADGE_COLOR }}
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
          label="Current loan amount"
          value={currentLoanAmount}
        />
        <StatInfo
          flexType="row"
          label="New loan amount"
          value={newLoanAmount}
        />
        <StatInfo
          flexType="row"
          label="Interest decrease"
          value={`-${REFINANCE_INTEREST_TIC / 100} %`}
          valueType={VALUES_TYPES.string}
        />
      </div>
      <LoadingModal visible={loadingModalVisible} />
    </AuctionCardBackdrop>
  );
};

export default RefinanceAuctionCard;
