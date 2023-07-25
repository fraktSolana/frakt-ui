import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { staking } from 'fbonds-core/lib/fbond-protocol/functions';
import { signAndSendV0TransactionWithLookupTablesSeparateSignatures } from 'fbonds-core/lib/fbond-protocol/utils';

import { sendTxnPlaceHolder } from '@frakt/utils';
import { AdventureNft } from '@frakt/api/adventures';
import { Adventure } from 'fbonds-core/lib/fbond-protocol/types';

import { getAdventureStatus, isSubscriptionActive } from './helpers';
import { AdventureStatus } from './types';
import { chunk } from 'lodash';

const BONDS_PROGRAM_PUBKEY = new web3.PublicKey(
  process.env.BONDS_PROGRAM_PUBKEY,
);
const BANX_STAKING_WHITELIST_ENTRY_PUBKEY = new web3.PublicKey(
  process.env.BANX_STAKING_WHITELIST_ENTRY_PUBKEY,
);
const BANX_STAKING_HADO_REGISTRY_PUBKEY = new web3.PublicKey(
  process.env.BANX_STAKING_HADO_REGISTRY_PUBKEY,
);

const CHUNK_SIZE_NORMAL = 20;
const CHUNK_SIZE_LEDGER = 5;

type StakeNfts = (props: {
  nftMints: string[];
  adventures: Adventure[];
  connection: web3.Connection;
  wallet: WalletContextState;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: (error?: any) => void;
  commitment?: web3.Commitment;
  isLedger?: boolean;
}) => Promise<boolean>;
export const stakeNfts: StakeNfts = async ({
  nftMints = [],
  adventures = [],
  connection,
  wallet,
  onAfterSend,
  onSuccess,
  onError,
  commitment = 'confirmed',
  isLedger = false,
}): Promise<boolean> => {
  const txnsData = await Promise.all(
    nftMints.map((mint) =>
      staking.manageStake.stakeBanx({
        accounts: {
          whitelistEntry: BANX_STAKING_WHITELIST_ENTRY_PUBKEY,
          hadoRegistry: BANX_STAKING_HADO_REGISTRY_PUBKEY,
          userPubkey: wallet.publicKey,
          tokenMint: new web3.PublicKey(mint),
        },
        addComputeUnits: true,
        args: {
          weeksOfSubscriptions: adventures.map(({ periodStartedAt }) =>
            staking.helpers.adventureTimestampToWeeks(periodStartedAt),
          ),
        },
        connection,
        programId: BONDS_PROGRAM_PUBKEY,
        sendTxn: sendTxnPlaceHolder,
      }),
    ),
  );

  return await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
    skipTimeout: true,
    notBondTxns: [],
    createLookupTableTxns: [],
    extendLookupTableTxns: [],
    v0InstructionsAndSigners: [],
    fastTrackInstructionsAndSigners: txnsData.map(
      ({ instructions, signers }) => ({
        instructions,
        signers,
        lookupTablePublicKeys: [],
      }),
    ),
    split: isLedger ? CHUNK_SIZE_LEDGER : CHUNK_SIZE_NORMAL,
    connection,
    wallet,
    commitment,
    onAfterSend,
    onSuccess,
    onError,
  });
};

type UnstakeNfts = (props: {
  nfts: AdventureNft[];
  connection: web3.Connection;
  wallet: WalletContextState;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: (error?: any) => void;
  commitment?: web3.Commitment;
  isLedger?: boolean;
}) => Promise<boolean>;
export const unstakeNfts: UnstakeNfts = async ({
  nfts = [],
  connection,
  wallet,
  onAfterSend,
  onSuccess,
  onError,
  commitment = 'confirmed',
  isLedger = false,
}): Promise<boolean> => {
  const txnsData = await Promise.all(
    nfts.map((nft) =>
      staking.manageStake.unstakeBanx({
        accounts: {
          banxStake: new web3.PublicKey(nft?.banxStake?.publicKey),
          userPubkey: wallet.publicKey,
          tokenMint: new web3.PublicKey(nft.mint),
          subscriptionsAndAdventures: nft.subscriptions
            .filter(isSubscriptionActive)
            .map(({ publicKey, adventure }) => ({
              adventure: new web3.PublicKey(adventure),
              adventureSubscription: new web3.PublicKey(publicKey),
            })),
        },
        addComputeUnits: true,
        connection,
        programId: BONDS_PROGRAM_PUBKEY,
        sendTxn: sendTxnPlaceHolder,
      }),
    ),
  );

  return await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
    skipTimeout: true,
    notBondTxns: [],
    createLookupTableTxns: [],
    extendLookupTableTxns: [],
    v0InstructionsAndSigners: [],
    fastTrackInstructionsAndSigners: txnsData.map(
      ({ instructions, signers }) => ({
        instructions,
        signers,
        lookupTablePublicKeys: [],
      }),
    ),
    split: isLedger ? CHUNK_SIZE_LEDGER : CHUNK_SIZE_NORMAL,
    connection,
    wallet,
    commitment,
    onAfterSend,
    onSuccess,
    onError,
  });
};

type SubscribeNfts = (props: {
  nfts: AdventureNft[];
  adventureToSubscribe: Adventure;
  allAdventures: Adventure[];
  connection: web3.Connection;
  wallet: WalletContextState;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: (error?: any) => void;
  commitment?: web3.Commitment;
  isLedger?: boolean;
}) => Promise<boolean>;
export const subscribeNfts: SubscribeNfts = async ({
  nfts = [],
  adventureToSubscribe,
  allAdventures,
  connection,
  wallet,
  commitment = 'confirmed',
  onAfterSend,
  onSuccess,
  onError,
  isLedger = false,
}): Promise<boolean> => {
  // const getSubsAndAdvsToUnsub = (nft: AdventureNft) => {
  //   if (!nft?.subscriptions) return [];
  //   return nft.subscriptions
  //     .filter(({ adventure: adventurePubkey }) => {
  //       const targetAdventure = allAdventures.find(
  //         ({ publicKey }) => publicKey === adventurePubkey,
  //       );
  //       const isEnded =
  //         getAdventureStatus(targetAdventure) === AdventureStatus.ENDED;
  //       return isEnded;
  //     })
  //     .map(({ adventure, publicKey }) => ({
  //       adventure: new web3.PublicKey(adventure),
  //       adventureSubscription: new web3.PublicKey(publicKey),
  //     })).slice(0, 1);
  // };

  const getAdventureToUnsub = (nft: AdventureNft) => {
    if (!nft?.subscriptions) return [];
    const foundAdventureToUnsub = nft.subscriptions
      .filter(({ adventure: adventurePubkey, unsubscribedAt, harvestedAt }) => {
        const targetAdventure = allAdventures.find(
          ({ publicKey }) => publicKey === adventurePubkey,
        );
        const isEnded =
          getAdventureStatus(targetAdventure) === AdventureStatus.ENDED;
        return isEnded && unsubscribedAt === 0 && harvestedAt === 0;
      })
      .map(({ adventure, publicKey }) => ({
        adventureUnsub: new web3.PublicKey(adventure),
        adventureSubscriptionUnsub: new web3.PublicKey(publicKey),
      }))
      .slice(0, 1);

    return foundAdventureToUnsub.length > 0
      ? foundAdventureToUnsub[0]
      : {
          adventureUnsub: undefined,
          adventureSubscriptionUnsub: undefined,
        };
  };

  const nftChunks = chunk(nfts, 2);

  console.log('nftChunks: ', nftChunks.slice(0, 1));
  console.log(
    JSON.stringify(
      nftChunks
        .map((nfts) =>
          nfts.map((nft) => ({
            subscriptionWeeks: staking.helpers.adventureTimestampToWeeks(
              adventureToSubscribe.periodStartedAt,
            ),
            banxStakeSub: new web3.PublicKey(nft.banxStake.publicKey),

            ...getAdventureToUnsub(nft),
          })),
        )
        .slice(0, 1),
      null,
      2,
    ),
  );

  const txnsData = await Promise.all(
    nftChunks.map((nfts) =>
      staking.adventure.subAndUnsubOrHarvestWeeksEnhanced({
        accounts: {
          userPubkey: wallet.publicKey,
        },
        args: {
          subAndUnsubParams: nfts.map((nft) => ({
            subscriptionWeeks: staking.helpers.adventureTimestampToWeeks(
              adventureToSubscribe.periodStartedAt,
            ),
            banxStakeSub: new web3.PublicKey(nft.banxStake.publicKey),

            ...getAdventureToUnsub(nft),
          })),
        },
        connection,
        programId: BONDS_PROGRAM_PUBKEY,
        sendTxn: sendTxnPlaceHolder,
        addComputeUnits: true,
      }),
    ),
  );

  return await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
    skipTimeout: true,
    notBondTxns: [],
    createLookupTableTxns: [],
    extendLookupTableTxns: [],
    v0InstructionsAndSigners: [],
    fastTrackInstructionsAndSigners: txnsData.map(
      ({ instructions, signers }) => ({
        instructions,
        signers,
        lookupTablePublicKeys: [],
      }),
    ),
    split: isLedger ? CHUNK_SIZE_LEDGER : CHUNK_SIZE_NORMAL,
    connection,
    wallet,
    commitment,
    onAfterSend,
    onSuccess,
    onError,
  });
};
