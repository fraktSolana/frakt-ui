import { Fragment } from 'react';

import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';

import { useFetchAuctionsList, useFetchRefinanceAuctions } from './hooks';
import ClassicAuctionCard from '../ClassicAuctionCard/ClassicAuctionCard';
import BondAuctionCard from '../BondAuctionCard/BondAuctionCard';
import RefinanceAuctionCard from '../RefinanceAuctionCard';

import styles from './OngoingAuctionTab.module.scss';

const OngoingAuctionTab = () => {
  const {
    data: refinanceAuctions,
    loading: isRefinanceAuctionsListLoading,
    hideAuction: hideRefinanceAuction,
  } = useFetchRefinanceAuctions();

  const {
    data: auctionsList,
    loading: isAuctionsListLoading,
    hideAuction,
  } = useFetchAuctionsList();

  const auctionCards = [
    ...refinanceAuctions.map((auction) => ({
      key: auction.nftMint,
      component: (
        <RefinanceAuctionCard
          auction={auction}
          hideAuction={hideRefinanceAuction}
        />
      ),
    })),
    ...auctionsList.map((auction) => ({
      key: auction.nftMint,
      component: auction?.bondParams?.fbondPubkey ? (
        <BondAuctionCard auction={auction} hideAuction={hideAuction} />
      ) : (
        <ClassicAuctionCard auction={auction} hideAuction={hideAuction} />
      ),
    })),
  ];

  const isLoading = isAuctionsListLoading || isRefinanceAuctionsListLoading;
  const showList = !!auctionCards?.length && !isLoading;
  const showEmptyList = !showList && !isLoading;

  return (
    <>
      {isLoading && <Loader />}
      {showList && (
        <div className={styles.auctionsList}>
          {auctionCards.map(({ key, component }) => (
            <Fragment key={key}>{component}</Fragment>
          ))}
        </div>
      )}
      {showEmptyList && <EmptyList text="No ongoing auctions at the moment" />}
    </>
  );
};

export default OngoingAuctionTab;
