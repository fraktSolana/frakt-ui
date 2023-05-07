import { BorrowNft } from '@frakt/api/nft';

export const parseNft = (nfts: BorrowNft[]) => {
  return nfts.map((nft) => {
    return {
      nftName: nft.name,
      pubkey: nft.mint,
      nftImage: nft?.imageUrl,
      maxLoanValue: (nft?.maxLoanValue / 1e9)?.toFixed(0),
      duration: nft?.classicParams.timeBased.returnPeriodDays,
      fee: 1,
    };
  });
};
