import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { AuctionListItem } from '@frakt/api/raffle';

import { useFetchAuctionsList } from '../LiquidationsPage/hooks';
import AuctionCard from './components/AuctionCard/AuctionCard';

import styles from './AuctionsPage.module.scss';

const AuctionsPage = () => {
  const { data: auctionsList, hideAuction } = useFetchAuctionsList(); // TODO: replace on another request

  const createAuctionsList = () => {
    return auctionsList.map((auction: AuctionListItem) => (
      <AuctionCard
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
