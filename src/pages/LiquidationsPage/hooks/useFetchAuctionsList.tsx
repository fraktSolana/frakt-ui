import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import produce from 'immer';

import { AuctionListItem, fetchAuctionsList } from '@frakt/api/raffle';

export const useFetchAuctionsList = () => {
  const { hiddenAuctionsPubkeys, hideAuction } = useHiddenAuctionPubkeys();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: AuctionListItem[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(['fetchAuctionsList'], () => fetchAuctionsList(), {
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  return {
    data:
      AUCTIONS_LIST?.filter(
        ({ nftMint }) => !hiddenAuctionsPubkeys.includes(nftMint),
      ) || [],
    loading: isLoading || isFetching,
    hideAuction,
  };
};

interface HiddenAuctionsPubkeysState {
  hiddenAuctionsPubkeys: string[];
  hideAuction: (nftMint: string) => void;
}
const useHiddenAuctionPubkeys = create<HiddenAuctionsPubkeysState>((set) => ({
  hiddenAuctionsPubkeys: [],
  hideAuction: (nftMint) =>
    set(
      produce((state: HiddenAuctionsPubkeysState) => {
        state.hiddenAuctionsPubkeys = [...state.hiddenAuctionsPubkeys, nftMint];
      }),
    ),
}));

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
