import { bidOnAuction as bidOnAuctionTransaction } from 'fraktionalizer-client-library';

import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';
import { wrapAsyncWithTryCatch } from '../../../utils';
import fraktionConfig from '../../fraktion/config';
import { VaultData } from '../../fraktion';
interface BidOnAuctionParams {
  vaultInfo: VaultData;
  price: number;
}

interface BidOnAuctionRawParams
  extends BidOnAuctionParams,
    WalletAndConnection {}

export const rawBidOnAuction = async ({
  wallet,
  connection,
  vaultInfo,
  price,
}: BidOnAuctionRawParams): Promise<void> => {
  const supply = vaultInfo.fractionsSupply.toNumber();
  const perShare = Math.ceil((price * 1e9) / supply);
  const bidCap = perShare * supply;

  await bidOnAuctionTransaction({
    connection,
    winning_bid: vaultInfo.auction.auction.currentWinningBidPubkey,
    bidPerShare: perShare,
    bidCap,
    adminPubkey: fraktionConfig.ADMIN_PUBKEY,
    userPubkey: wallet.publicKey,
    vault: vaultInfo.vaultPubkey,
    auction: vaultInfo.auction.auction.auctionPubkey,
    fractionMint: vaultInfo.fractionMint,
    fractionTreasury: vaultInfo.fractionTreasury,
    redeemTreasury: vaultInfo.redeemTreasury,
    priceMint: vaultInfo.priceMint,
    vaultProgramId: fraktionConfig.PROGRAM_PUBKEY,
    sendTxn: async (transaction, signers) => {
      await signAndConfirmTransaction({
        transaction,
        signers,
        connection,
        wallet,
      });
    },
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawBidOnAuction, {
  onSuccessMessage: 'Bid placed successfully',
  onErrorMessage: 'Transaction failed',
});

export const bidOnAuction = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
