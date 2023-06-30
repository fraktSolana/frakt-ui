import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useWalletModal } from '@frakt/components/WalletModal';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { RefinanceAuctionListItem } from '@frakt/api/raffle';
import Button from '@frakt/components/Button';
import {
  GeneralCardInfo,
  StatsRaffleValues,
} from '@frakt/pages/LiquidationsPage/components/StatsRaffleValues';
import { useAuctionCard } from './hooks';

import styles from './AuctionCard.module.scss';
import { parseRefinanceAuctionsInfo } from './helpers';

interface AuctionCardProps {
  auction: RefinanceAuctionListItem;
  hideAuction?: (value: string) => void;
}

const DENOMINATIOR_PERCENT = 21 / 1e5; // DUTCH_AUCTION_RATE

const AuctionCard: FC<AuctionCardProps> = ({ auction, hideAuction }) => {
  const { connected } = useWallet();
  const { setVisible: setVisibleWalletModal } = useWalletModal();

  const {
    nftImageUrl,
    nftName,
    floorPrice,
    nextInterest,
    timeToNextRound,
    currentInterest,
    nftCollectionName,
  } = parseRefinanceAuctionsInfo(auction);

  const { onSubmit, loadingModalVisible } = useAuctionCard(
    auction,
    hideAuction,
  );

  const onHandleSubmit = () => {
    if (connected) {
      onSubmit();
    } else {
      setVisibleWalletModal(true);
    }
  };

  return (
    <div className={styles.card}>
      <GeneralCardInfo
        nftName={nftName}
        nftImageUrl={nftImageUrl}
        nftCollectionName={nftCollectionName}
      />
      <div className={styles.statsValue}>
        <StatsRaffleValues
          className={styles.opacity}
          label="Floor price"
          value={floorPrice}
        />
        <StatsRaffleValues label="Next round start">
          Every 1 sec
        </StatsRaffleValues>
        <StatsRaffleValues label="Loan interest" value={currentInterest} />
        <StatsRaffleValues label="Interest decrease">
          -{DENOMINATIOR_PERCENT} %
        </StatsRaffleValues>
      </div>
      <Button
        onClick={onHandleSubmit}
        type="secondary"
        className={styles.button}
      >
        {connected ? 'Refinance' : 'Connect wallet'}
      </Button>
      <LoadingModal visible={loadingModalVisible} />
    </div>
  );
};

export default AuctionCard;
