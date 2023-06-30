import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useWalletModal } from '@frakt/components/WalletModal';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { RefinanceAuctionListItem } from '@frakt/api/auctions';
import Button from '@frakt/components/Button';
import {
  GeneralCardInfo,
  StatsRaffleValues,
} from '@frakt/pages/LiquidationsPage/components/StatsRaffleValues';
import { useAuctionCard } from './hooks';

import styles from './AuctionCard.module.scss';
import {
  REFINANCE_INTEREST_REFRESH_RATE,
  REFINANCE_INTEREST_TIC,
  parseRefinanceAuctionsInfo,
} from './helpers';

interface AuctionCardProps {
  auction: RefinanceAuctionListItem;
  hideAuction?: (value: string) => void;
}

const AuctionCard: FC<AuctionCardProps> = ({ auction, hideAuction }) => {
  const { connected } = useWallet();
  const { setVisible: setVisibleWalletModal } = useWalletModal();

  const {
    nftImageUrl,
    nftName,
    floorPrice,
    currentLoanAmount,
    newLoanAmount,
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
          Every {REFINANCE_INTEREST_REFRESH_RATE} sec
        </StatsRaffleValues>
        <StatsRaffleValues
          label="Current loan amount"
          value={currentLoanAmount}
        />
        <StatsRaffleValues label="New loan amount" value={newLoanAmount} />
        <StatsRaffleValues label="Interest decrease">
          -{REFINANCE_INTEREST_TIC / 100} %
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
