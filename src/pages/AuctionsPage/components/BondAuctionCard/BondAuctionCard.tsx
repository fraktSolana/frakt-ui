import { FC, useEffect, useState } from 'react';
import moment from 'moment';

import { StatInfo, VALUES_TYPES } from '@frakt/components/StatInfo';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { BondAuctionItem } from '@frakt/api/auctions';

import { checkPriceThreshold, parseAuctionsInfo } from './helpers';
import AuctionCardBackdrop from '../AuctionCardBackdrop';
import AuctionNFTCardInfo from '../AuctionNFTCardInfo';
import { useBondAuctionCard } from './hooks';

import styles from './BondAuctionCard.module.scss';

interface BondAuctionCardProps {
  auction: BondAuctionItem;
  hideAuction: (value: string) => void;
}

const DENOMINATIOR_PERCENT = 21 / 1e5; // DUTCH_AUCTION_RATE

const BondAuctionCard: FC<BondAuctionCardProps> = ({
  auction,
  hideAuction,
}) => {
  const { onSubmit, loadingModalVisible } = useBondAuctionCard(
    auction,
    hideAuction,
  );

  const { floorPrice } = parseAuctionsInfo(auction);

  const [isAuctionPriceBelowThreshold, setIsAuctionPriceBelowThreshold] =
    useState<boolean>(false);

  return (
    <AuctionCardBackdrop
      onSubmit={onSubmit}
      button={{ text: 'Liquidate', disabled: isAuctionPriceBelowThreshold }}
      badge={{ text: 'Collateral redemption' }}
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
          value="Every 1 sec"
          valueType={VALUES_TYPES.string}
        />
        <PriceSubtraction
          initialPrice={floorPrice}
          percentage={DENOMINATIOR_PERCENT}
          startTime={moment.unix(auction?.bondParams?.startAuctionTime)}
          setIsAuctionPriceBelowThreshold={setIsAuctionPriceBelowThreshold}
        />
        <StatInfo
          flexType="row"
          label="Price decrease"
          value={`-${DENOMINATIOR_PERCENT} %`}
          valueType={VALUES_TYPES.string}
        />
      </div>
      <LoadingModal visible={loadingModalVisible} />
    </AuctionCardBackdrop>
  );
};

export default BondAuctionCard;

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

  return (
    <StatInfo
      flexType="row"
      label="Buy price"
      value={price?.toFixed(3)}
      valueType={VALUES_TYPES.string}
    />
  );
};
