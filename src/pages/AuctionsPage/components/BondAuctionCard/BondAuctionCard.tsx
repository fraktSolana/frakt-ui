import { FC, useEffect, useState } from 'react';
import moment from 'moment';

import { StatInfo, VALUES_TYPES } from '@frakt/components/StatInfo';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { BondAuctionItem } from '@frakt/api/auctions';
import { ArrowDownLeft } from '@frakt/icons';

import AuctionCardBackdrop from '../AuctionCardBackdrop';
import AuctionNFTCardInfo from '../AuctionNFTCardInfo';
import { parseAuctionsInfo } from './helpers';
import { useBondAuctionCard } from './hooks';

import styles from './BondAuctionCard.module.scss';

interface BondAuctionCardProps {
  auction: BondAuctionItem;
  hideAuction: (value: string) => void;
}

const DENOMINATOR_PERCENT = 42 / 1e5; // DUTCH_AUCTION_RATE

const BondAuctionCard: FC<BondAuctionCardProps> = ({
  auction,
  hideAuction,
}) => {
  const { onSubmit, loadingModalVisible } = useBondAuctionCard(
    auction,
    hideAuction,
  );

  const { floorPrice } = parseAuctionsInfo(auction);

  return (
    <AuctionCardBackdrop
      onSubmit={onSubmit}
      button={{ text: 'Buy' }}
      badge={{ text: 'Liquidate', icon: ArrowDownLeft }}
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
          percentage={DENOMINATOR_PERCENT}
          startTime={moment.unix(auction?.bondParams?.startAuctionTime)}
        />
        <StatInfo
          flexType="row"
          label="Price decrease"
          value={`-${DENOMINATOR_PERCENT} %`}
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
}

const PriceSubtraction: FC<PriceSubtractionProps> = ({
  initialPrice,
  percentage,
  startTime,
}) => {
  const initialPriceNumber = parseFloat(initialPrice);
  const [price, setPrice] = useState<number>(0);

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

  const displayPrice = price > 0 ? price : 0;

  return <StatInfo flexType="row" label="Buy price" value={displayPrice} />;
};
