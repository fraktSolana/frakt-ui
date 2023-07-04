import { Fragment } from 'react';

import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';

import { useOngoingAuctionTab, useSortAndFilterAuctions } from './hooks';
import ClassicAuctionCard from '../ClassicAuctionCard/ClassicAuctionCard';
import BondAuctionCard from '../BondAuctionCard/BondAuctionCard';
import RefinanceAuctionCard from '../RefinanceAuctionCard';
import FilterSection from '../FilterSection';

import styles from './OngoingAuctionTab.module.scss';

const OngoingAuctionTab = () => {
  const { isLoading, showList, showEmptyList, hideAuction, allAuctions } =
    useOngoingAuctionTab();

  const { auctions, sortProps, filterProps, searchProps } =
    useSortAndFilterAuctions(allAuctions);

  return (
    <>
      <FilterSection
        sortProps={sortProps}
        filterProps={filterProps}
        searchProps={searchProps}
      />
      {isLoading && <Loader />}
      {showList && (
        <div className={styles.auctionsList}>
          {auctions.map((auction) => (
            <Fragment key={auction.nftMint}>
              <AuctionCard auction={auction} hideAuction={hideAuction} />
            </Fragment>
          ))}
        </div>
      )}
      {showEmptyList && <EmptyList text="No ongoing auctions at the moment" />}
    </>
  );
};

export default OngoingAuctionTab;

const AuctionCard = ({ auction, hideAuction }) => {
  const isRefinanceAuction = auction?.bondParams?.auctionRefinanceStartTime;
  const isBondAuction = auction?.bondParams?.startAuctionTime;

  if (isRefinanceAuction) {
    return <RefinanceAuctionCard auction={auction} hideAuction={hideAuction} />;
  }

  if (isBondAuction) {
    return <BondAuctionCard auction={auction} hideAuction={hideAuction} />;
  }

  return <ClassicAuctionCard auction={auction} hideAuction={hideAuction} />;
};
