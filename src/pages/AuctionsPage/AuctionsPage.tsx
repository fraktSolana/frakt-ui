import { AppLayout } from '@frakt/components/Layout/AppLayout';

import { RefinanceAuctionListItem } from '@frakt/api/auctions';
import AuctionRefinanceCard from './components/RefinanceAuctionCard/RefinanceAuctionCard';
import { useFetchRefinanceAuctions } from './hooks';

import styles from './AuctionsPage.module.scss';

const AuctionsPage = () => {
  const { data: auctions, hideAuction } = useFetchRefinanceAuctions();

  const createAuctionsList = () => {
    return auctions.map((auction: RefinanceAuctionListItem) => (
      <AuctionRefinanceCard
        key={auction.nftMint}
        auction={auction}
        hideAuction={hideAuction}
      />
    ));
  };

  return (
    <AppLayout>
      <div className={styles.rafflesList}>{createAuctionsList()}</div>
    </AppLayout>
  );
};

export default AuctionsPage;
