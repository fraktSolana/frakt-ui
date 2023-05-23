import { FC } from 'react';
import { commonActions } from '@frakt/state/common/actions';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { AuctionListItem } from '@frakt/api/raffle';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { createTimerJSX } from '@frakt/components/Timer';
import Button from '@frakt/components/Button';
import { Timer } from '@frakt/icons';

import { GeneralCardInfo, StatsRaffleValues } from '../StatsRaffleValues';
import { useAuctionCard } from './useAuctionCard';
import styles from './AuctionCard.module.scss';

interface AuctionCardProps {
  auction: AuctionListItem;
  hideAuction: (value: string) => void;
}

const AuctionCard: FC<AuctionCardProps> = ({ auction, hideAuction }) => {
  const { connected } = useWallet();
  const dispatch = useDispatch();

  const {
    onSubmit,
    closeLoadingModal,
    loadingModalVisible,
    buyPrice,
    timeToNextRound,
    nextPrice,
  } = useAuctionCard(auction, hideAuction);

  const onHandleSubmit = () => {
    if (connected) {
      onSubmit();
    } else {
      dispatch(commonActions.setWalletModal({ isVisible: true }));
    }
  };

  return (
    <>
      <div className={styles.card}>
        <GeneralCardInfo
          nftName={auction.nftName}
          nftImageUrl={auction.nftImageUrl}
          nftCollectionName={auction.nftCollectionName}
        />
        <div className={styles.statsValue}>
          <StatsRaffleValues
            className={styles.opacity}
            label="Floor price"
            value={auction?.classicParams?.floorPrice}
          />
          <StatsRaffleValues label="Next round start">
            <div className={styles.wrapper}>
              <Timer />
              <div className={styles.countdown}>
                {createTimerJSX({
                  expiredAt: moment.unix(timeToNextRound),
                  isSecondType: true,
                })}
              </div>
            </div>
          </StatsRaffleValues>
          <StatsRaffleValues label="Next round price" value={nextPrice} />
          <StatsRaffleValues label="Buy price" value={buyPrice} />
        </div>
        <Button
          onClick={onHandleSubmit}
          type="secondary"
          className={styles.button}
        >
          {connected ? 'Liquidate' : 'Connect wallet'}
        </Button>
      </div>
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};

export default AuctionCard;
