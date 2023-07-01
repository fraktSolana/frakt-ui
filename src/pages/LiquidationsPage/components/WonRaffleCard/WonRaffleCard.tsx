import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import moment from 'moment';

import { shortenAddress } from '@frakt/utils/solanaUtils';
import { WonRaffleListItem } from '@frakt/api/raffle';

import { GeneralCardInfo, StatsRaffleValues } from '../StatsRaffleValues';
import SolscanNftLink from '../SolscanNftLink';

import styles from './WonRaffleCard.module.scss';

interface WonRaffleCardProps {
  raffle: WonRaffleListItem;
}

const WonRaffleCard: FC<WonRaffleCardProps> = ({ raffle }) => {
  const { publicKey } = useWallet();
  const isWinner = raffle?.user === publicKey?.toBase58();

  return (
    <div className={styles.cardWrapper}>
      <div className={classNames(styles.card, isWinner && styles.cardWinner)}>
        <div className={styles.content}>
          <GeneralCardInfo
            nftName={raffle?.nftName}
            nftImageUrl={raffle?.nftImageUrl}
            nftCollectionName={raffle?.nftCollectionName}
          />
          <SolscanNftLink nftMint={raffle?.nftMint} />
        </div>
        <div className={styles.statsValue}>
          <StatsRaffleValues
            className={styles.opacity}
            label="Floor price"
            value={raffle?.nftFloorPrice}
          />
          <StatsRaffleValues
            label="Liquidation price"
            value={raffle?.liquidationPrice}
          />
          <StatsRaffleValues label="Winner">
            {createWinnerFieldJSX(raffle, isWinner)}
          </StatsRaffleValues>
          <StatsRaffleValues label="Winner spent">
            <span>{raffle?.winnerTickets} TICKETS</span>
          </StatsRaffleValues>
          <StatsRaffleValues label="Total spent">
            <span>{raffle?.totalTickets} TICKETS</span>
          </StatsRaffleValues>
          <StatsRaffleValues label="Ended">
            <span>{moment(raffle?.expiredAt).fromNow(false)}</span>
          </StatsRaffleValues>
        </div>
      </div>
    </div>
  );
};

export default WonRaffleCard;

const createWinnerFieldJSX = (raffle: WonRaffleListItem, isWinner: boolean) => (
  <div className={isWinner ? styles.winner : ''}>
    {isWinner && <div className={styles.winnerBadge}>You!</div>}
    <p className={styles.value}>
      {raffle?.user && shortenAddress(raffle?.user)}
    </p>
  </div>
);
