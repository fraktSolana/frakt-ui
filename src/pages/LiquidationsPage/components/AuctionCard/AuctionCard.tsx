import { FC, useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { LoadingModal } from '@frakt/components/LoadingModal';
import { commonActions } from '@frakt/state/common/actions';
import { createTimerJSX } from '@frakt/components/Timer';
import { AuctionListItem } from '@frakt/api/raffle';
import Button from '@frakt/components/Button';
import { Timer } from '@frakt/icons';

import { GeneralCardInfo, StatsRaffleValues } from '../StatsRaffleValues';
import { checkPriceThreshold, parseAuctionsInfo } from './helpers';
import { useAuctionCard } from './useAuctionCard';

import styles from './AuctionCard.module.scss';

interface AuctionCardProps {
  auction: AuctionListItem;
  hideAuction: (value: string) => void;
}

const DENOMINATIOR_PERCENT = 7 / 1e4;

const AuctionCard: FC<AuctionCardProps> = ({ auction, hideAuction }) => {
  const { connected } = useWallet();
  const dispatch = useDispatch();

  const { onSubmit, closeLoadingModal, loadingModalVisible } = useAuctionCard(
    auction,
    hideAuction,
  );

  const onHandleSubmit = () => {
    if (connected) {
      onSubmit();
    } else {
      dispatch(commonActions.setWalletModal({ isVisible: true }));
    }
  };

  const {
    nextPrice,
    nftImageUrl,
    nftName,
    floorPrice,
    isBondAuction,
    timeToNextRound,
    buyPrice,
    nftCollectionName,
  } = parseAuctionsInfo(auction);

  const [isAuctionPriceBelowThreshold, setIsAuctionPriceBelowThreshold] =
    useState<boolean>(false);

  return (
    <>
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
          {isBondAuction ? (
            <StatsRaffleValues label="Next round start">
              Every 1 sec
            </StatsRaffleValues>
          ) : (
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
          )}
          {isBondAuction ? (
            <PriceSubtraction
              initialPrice={floorPrice}
              percentage={DENOMINATIOR_PERCENT}
              startTime={moment.unix(auction?.bondParams?.startAuctionTime)}
              setIsAuctionPriceBelowThreshold={setIsAuctionPriceBelowThreshold}
            />
          ) : (
            <StatsRaffleValues label="Buy price" value={buyPrice} />
          )}
          {isBondAuction ? (
            <StatsRaffleValues label="Price decrease">
              -{DENOMINATIOR_PERCENT} %
            </StatsRaffleValues>
          ) : (
            <StatsRaffleValues label="Next round price" value={nextPrice} />
          )}
        </div>
        <Button
          disabled={isAuctionPriceBelowThreshold}
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

interface PriceSubtractionProps {
  initialPrice: string;
  percentage: number;
  startTime: moment.Moment;
  setIsAuctionPriceBelowThreshold: (value: boolean) => void;
}

const PriceSubtraction: FC<PriceSubtractionProps> = ({
  initialPrice,
  percentage,
  startTime,
  setIsAuctionPriceBelowThreshold,
}) => {
  const initialPriceNumber = parseFloat(initialPrice);
  const [price, setPrice] = useState<number>(0);

  const isBelowThreshold = checkPriceThreshold(parseFloat(initialPrice), price);

  useEffect(() => {
    setIsAuctionPriceBelowThreshold(isBelowThreshold);
  }, [isBelowThreshold]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = moment();

      if (currentTime.isSameOrAfter(startTime)) {
        const elapsedTime = Math.floor(currentTime.diff(startTime, 'seconds'));
        const newPrice =
          initialPriceNumber -
          (initialPriceNumber * percentage * elapsedTime) / 100;
        setPrice(newPrice);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [initialPrice, percentage, startTime]);

  return <StatsRaffleValues label="Buy price" value={price?.toFixed(3)} />;
};
