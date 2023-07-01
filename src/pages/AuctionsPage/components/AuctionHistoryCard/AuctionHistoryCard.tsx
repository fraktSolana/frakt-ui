import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import moment from 'moment';

import { StatInfo, VALUES_TYPES } from '@frakt/components/StatInfo';
import { shortenAddress } from '@frakt/utils/solanaUtils';
import { WonRaffleListItem } from '@frakt/api/raffle';

import AuctionNFTCardInfo from '../AuctionNFTCardInfo';

import styles from './AuctionHistoryCard.module.scss';

interface AuctionHistoryCardProps {
  auction: WonRaffleListItem;
}

const AuctionHistoryCard: FC<AuctionHistoryCardProps> = ({ auction }) => {
  const { publicKey } = useWallet();
  const isWinner = auction?.user === publicKey?.toBase58();

  return (
    <div className={styles.cardWrapper}>
      <div className={classNames(styles.card, isWinner && styles.cardWinner)}>
        <div className={styles.content}>
          <AuctionNFTCardInfo {...auction} />
          {/* <SolscanNftLink nftMint={raffle?.nftMint} /> */}
        </div>
        <div className={styles.statsValues}>
          <StatInfo
            flexType="row"
            classNamesProps={{ container: styles.opacity }}
            label="Floor price"
            value={auction?.nftFloorPrice}
          />
          <StatInfo
            flexType="row"
            label="Liquidation price"
            value={auction?.liquidationPrice}
          />
          <StatInfo
            flexType="row"
            label="Winner"
            value={createWinnerFieldJSX(auction, isWinner)}
            valueType={VALUES_TYPES.string}
          />
          <StatInfo
            flexType="row"
            label="Winner spent"
            value={auction?.winnerTickets}
          />
          <StatInfo
            flexType="row"
            label="Ended"
            value={<span>{moment(auction?.expiredAt).fromNow(false)}</span>}
            valueType={VALUES_TYPES.string}
          />
        </div>
      </div>
    </div>
  );
};

export default AuctionHistoryCard;

const createWinnerFieldJSX = (
  auction: WonRaffleListItem,
  isWinner: boolean,
) => (
  <div className={isWinner ? styles.winner : ''}>
    {isWinner && <div className={styles.winnerBadge}>You!</div>}
    <p className={styles.value}>
      {auction?.user && shortenAddress(auction?.user)}
    </p>
  </div>
);
