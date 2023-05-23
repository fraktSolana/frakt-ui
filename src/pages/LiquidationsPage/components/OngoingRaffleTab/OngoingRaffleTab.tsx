import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useIntersection } from '@frakt/hooks/useIntersection';
import { Loader } from '@frakt/components/Loader';
import EmptyList from '@frakt/components/EmptyList';

import LiquidationRaffleCard from '../LiquidationRaffleCard';
import { useRaffleSort } from '../Liquidations/hooks';
import RafflesList from '../RafflesList';
import AuctionCard from '../AuctionCard';
import {
  useFetchUserTickets,
  useFetchAuctionsList,
  useFetchRafflesList,
} from '../../hooks';

import styles from './OngoingRaffleTab.module.scss';
import { AuctionListItem, RaffleListItem } from '@frakt/api/raffle';

const OngoingRaffleTab: FC = () => {
  const { publicKey } = useWallet();

  const { lotteryTickets } = useFetchUserTickets();
  const { ref, inView } = useIntersection();
  const { queryData } = useRaffleSort();

  const userQueryData = { ...queryData, user: publicKey?.toBase58() };

  const {
    data: raffleList,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
  } = useFetchRafflesList({
    url: 'liquidation',
    id: 'ongoingRaffleList',
    queryData: userQueryData,
  });

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  const { data: auctionsList, loading, hideAuction } = useFetchAuctionsList();

  if (loading) return <Loader />;

  const createAuctionsList = () => {
    return AUCTIONS_LIST.map((auction: AuctionListItem) => (
      <AuctionCard
        key={auction.nftMint}
        auction={auction}
        hideAuction={hideAuction}
      />
    ));
  };

  const createRafflesList = () => {
    return raffleList.map((raffle: RaffleListItem) => (
      <LiquidationRaffleCard
        key={raffle.rafflePubKey}
        raffle={raffle}
        disabled={lotteryTickets?.currentTickets < 1}
      />
    ));
  };

  return (
    <RafflesList withRafflesInfo>
      {!!AUCTIONS_LIST?.length || !!raffleList?.length ? (
        <>
          <div className={styles.rafflesList}>
            {createAuctionsList()}
            {createRafflesList()}
            {!!isFetchingNextPage && <Loader />}
            <div ref={ref} />
          </div>
        </>
      ) : (
        <EmptyList text="No ongoing raffles at the moment" />
      )}
    </RafflesList>
  );
};

export default OngoingRaffleTab;

const AUCTIONS_LIST = [
  {
    nftMint: '7Mts3CB7kAsSa4HcLuvBRXqGMW26CmPJXayswuWFKiMt',
    nftName: 'Geomancer #1022',
    nftImageUrl:
      'https://nftstorage.link/ipfs/bafybeigowtxgxsccdwdtg3qqh3ad4x6dvzc6s7xzzlvojqotrrcn2s65ba/28.png',
    nftCollectionName: 'Geomancer',
    classicParams: {
      auctionPubkey: '6XEdDdm4G3NUVxfMVJLFPS7iVjv2HXwQqWKZm4Ww624Y',
      startPrice: 324567123,
      startedAt: 1677839722,
      delta: 1000000,
      deltaType: 'linear',
      denominator: 10,
      timeToNextRound: 1684773042,
      floorPrice: 0.065,
      nextPrice: -693.007,
      buyPrice: -693.006,
    },
  },
  {
    nftMint: '7Mts3CB7kAsSa4HcLuvBRXqGMW26CmPJXayswuWFKiMt',
    nftName: 'Geomancer #1022',
    nftImageUrl:
      'https://nftstorage.link/ipfs/bafybeigowtxgxsccdwdtg3qqh3ad4x6dvzc6s7xzzlvojqotrrcn2s65ba/28.png',
    nftCollectionName: 'Geomancer',
    classicParams: {
      auctionPubkey: 'AwbQRLEVHcZbCetMUY3JFazxibBHn38KzqWXwYKZ9GiG',
      startPrice: 324567123,
      startedAt: 1677841112,
      delta: 1000000,
      deltaType: 'linear',
      denominator: 10,
      timeToNextRound: 1684773042,
      floorPrice: 0.065,
      nextPrice: -692.868,
      buyPrice: -692.867,
    },
  },
  {
    nftMint: '4Uepu2KBFRmBrizDq4pqmGzyDVQhEhhiasaRB4UbYtjz',
    nftName: 'Entreprenerdz #9778',
    nftImageUrl:
      'https://shdw-drive.genesysgo.net/58ohwymyELzbAxMnF9L8AasNzA9Sx5fN45b45B69Mvh1/9778.jpg',
    bondParams: {
      fbondPubkey: 'HSA8PfUYPQLUgbkMZh9ZnD9ZtjTx9j8JYEnU8DChjzQG',
      collateralBox: 'HqExN5aSvfNiawZudUkERyJ28Nvc4hqgrugp33zERfTk',
      collateralBoxType: 'escrowless',
      collateralTokenMint: '4Uepu2KBFRmBrizDq4pqmGzyDVQhEhhiasaRB4UbYtjz',
      collateralTokenAccount: '9HMBtpyjr5KPEGQ7YWuJTgZFHwojLr8DnGD5RTR1mMhz',
      collateralOwner: 'B4yPWKFtGHESYPDd7sbtJPFLmk2wFZ2xc7pZqLkveAem',
      fraktMarket: 'GVJWA3ZRq4q2qBsZ51hHziyZc2pYpLQZ36bpHLvNYRbY',
      oracleFloor: '25uErXB4Rpx8RxFo4pNbtB4Hdd5bmDcZCANMLWbBLxpn',
      whitelistEntry: '5hahh3DNgScdRRhRHD5BXxgpKd1ZrkQrCXmuEMoYwVdx',
      floorPrice: 753327195,
      startAuctionTime: 1685101856,
      repayAccounts: [
        {
          bondTradeTransaction: '134seFYJqHNFaShkLSThwZCAbX4ERY4sLSJxZ38aFbm',
          bondOffer: '5MAF44YHuL9x5vACxdGLwPAWLRViTaywG2Cj44QDbKFX',
        },
      ],
    },
  },
  {
    nftMint: '4X74yDdbubZHStV7p4uGsbaGmShHUgFYEr5hWtygVTJd',
    nftName: 'Entreprenerdz #9165',
    nftImageUrl:
      'https://shdw-drive.genesysgo.net/58ohwymyELzbAxMnF9L8AasNzA9Sx5fN45b45B69Mvh1/9165.jpg',
    bondParams: {
      fbondPubkey: '3tDYrQ8iXPAtB5XBzmbknR12XiwfZu2Y2QmrDafaMwnM',
      collateralBox: '6i6aSZVM6vCHd8YHEvu6zKcndrjb7tgv7HcMbpoUBWJV',
      collateralBoxType: 'escrowless',
      collateralTokenMint: '4X74yDdbubZHStV7p4uGsbaGmShHUgFYEr5hWtygVTJd',
      collateralTokenAccount: 'DNsNfP9zGBJKSKA4SbzJEMiZTvh6RqrnF6d36Pw7wu49',
      collateralOwner: 'B4yPWKFtGHESYPDd7sbtJPFLmk2wFZ2xc7pZqLkveAem',
      fraktMarket: 'GVJWA3ZRq4q2qBsZ51hHziyZc2pYpLQZ36bpHLvNYRbY',
      oracleFloor: '25uErXB4Rpx8RxFo4pNbtB4Hdd5bmDcZCANMLWbBLxpn',
      whitelistEntry: '5hahh3DNgScdRRhRHD5BXxgpKd1ZrkQrCXmuEMoYwVdx',
      floorPrice: 753327195,
      startAuctionTime: 1685101951,
      repayAccounts: [
        {
          bondTradeTransaction: '6VukUoTSZ5iBMTHnRmWTdn9zPZdoztXukY2eyLoc4Piw',
          bondOffer: '5MAF44YHuL9x5vACxdGLwPAWLRViTaywG2Cj44QDbKFX',
        },
      ],
    },
  },
] as AuctionListItem[];
