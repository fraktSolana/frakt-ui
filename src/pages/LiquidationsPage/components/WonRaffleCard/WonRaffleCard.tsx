import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { equals } from 'ramda';
import moment from 'moment';
import cx from 'classnames';

import { shortenAddress } from '@frakt/utils/solanaUtils';
import { WonRaffleListItem } from '@frakt/api/raffle';
import { Solana } from '@frakt/icons';

import { GeneralCardInfo, StatsRaffleValues } from '../StatsRaffleValues';
import SolscanNftLink from '../SolscanNftLink';

import styles from './WonRaffleCard.module.scss';

interface WonRaffleCardProps {
  raffle: WonRaffleListItem;
}

const WonRaffleCard: FC<WonRaffleCardProps> = ({ raffle }) => {
  const { publicKey } = useWallet();
  const isWinner = equals(raffle?.user, publicKey?.toBase58());

  return (
    <div className={styles.cardWrapper}>
      <div className={cx(styles.card, isWinner && styles.cardWinner)}>
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
            {isWinner ? (
              <div className={styles.winner}>
                <div className={styles.winnerBadge}>You!</div>
                <p className={styles.value}>
                  {raffle?.user && shortenAddress(raffle?.user)}
                </p>
              </div>
            ) : (
              <p className={styles.value}>
                {raffle?.user && shortenAddress(raffle?.user)}
              </p>
            )}
          </StatsRaffleValues>
          <StatsRaffleValues label="Winner spent">
            {!raffle?.isAuction ? (
              <span>{raffle?.winnerTickets} TICKETS</span>
            ) : (
              <span className={styles.value}>
                <Solana />
                {raffle?.winnerTickets}
              </span>
            )}
          </StatsRaffleValues>
          {!raffle?.isAuction && (
            <StatsRaffleValues label="Total spent">
              <span>{raffle?.totalTickets} TICKETS</span>
            </StatsRaffleValues>
          )}
          <StatsRaffleValues label="Ended">
            <span>{moment(raffle?.expiredAt).fromNow(false)}</span>
          </StatsRaffleValues>
        </div>
      </div>
    </div>
  );
};

export default WonRaffleCard;
