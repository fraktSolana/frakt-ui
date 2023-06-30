export interface RefinanceAuctionListItem {
  nftMint: string;
  nftName: string;
  nftImageUrl: string;
  nftCollectionName: string;

  bondParams: {
    repayAccounts: {
      bondTradeTransaction: string;
      bondOffer: string;
      user: string;
    }[];
    fbondPubkey: string;
    oracleFloor: string;
    hadoMarket: string;

    floorPrice: number;
    auctionRefinanceStartTime: number;
    loanValue: number;
    repayValue: number;
  };
}
