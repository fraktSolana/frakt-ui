import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import moment from 'moment';

import { StatInfo, VALUES_TYPES } from '@frakt/components/StatInfo';
import { shortenAddress } from '@frakt/utils/solanaUtils';
import { AuctionHistoryItem } from '@frakt/api/auctions';

import AuctionNFTCardInfo from '../AuctionNFTCardInfo';

import styles from './AuctionHistoryCard.module.scss';

interface AuctionHistoryCardProps {
  auction: AuctionHistoryItem;
}

const AuctionHistoryCard: FC<AuctionHistoryCardProps> = ({ auction }) => {
  const { publicKey } = useWallet();

  const { nftFloorPrice, liquidationPrice, winnerTickets, expiredAt, user } =
    auction;

  const userIsWinner = user === publicKey?.toBase58();

  return (
    <div className={styles.cardWrapper}>
      <div
        className={classNames(styles.card, userIsWinner && styles.cardWinner)}
      >
        <div className={styles.content}>
          <AuctionNFTCardInfo {...auction} />
          {/* <SolscanNftLink nftMint={auction?.nftMint} /> */}
        </div>
        <div className={styles.statsValues}>
          <StatInfo
            flexType="row"
            classNamesProps={{ container: styles.opacity }}
            label="Floor price"
            value={nftFloorPrice}
          />
          <StatInfo
            flexType="row"
            label="Liquidation price"
            value={liquidationPrice}
          />
          <StatInfo
            flexType="row"
            label="Winner"
            value={createWinnerFieldJSX(user, userIsWinner)}
            valueType={VALUES_TYPES.string}
          />
          <StatInfo flexType="row" label="Winner spent" value={winnerTickets} />
          <StatInfo
            flexType="row"
            label="Ended"
            value={<span>{moment(expiredAt).fromNow(false)}</span>}
            valueType={VALUES_TYPES.string}
          />
        </div>
      </div>
    </div>
  );
};

export default AuctionHistoryCard;

const createWinnerFieldJSX = (user: string, userIsWinner: boolean) => (
  <div className={userIsWinner ? styles.winner : ''}>
    {userIsWinner && <div className={styles.winnerBadge}>You!</div>}
    <p className={styles.value}>{user && shortenAddress(user)}</p>
  </div>
);
