import { RefinanceAuctionListItem } from '@frakt/api/auctions';

import RefinanceAuctionCard from '../RefinanceAuctionCard';
import { useFetchRefinanceAuctions } from './hooks';

import styles from './OngoingAuctionTab.module.scss';
import BondAuctionCard from '../BondAuctionCard';

const OngoingAuctionTab = () => {
  const { data: auctions, hideAuction } = useFetchRefinanceAuctions();

  return (
    <div className={styles.auctionsList}>
      {auctions.map((auction: RefinanceAuctionListItem) => (
        <BondAuctionCard
          key={auction.nftMint}
          auction={auction}
          hideAuction={hideAuction}
        />
      ))}
    </div>
  );
};

export default OngoingAuctionTab;
