import { TokenInfo } from '@solana/spl-token-registry';
import classNames from 'classnames';
import { FC } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import {
  LoadingModal,
  useLoadingModal,
} from '../../../../../components/LoadingModal';
import {
  FusionPool,
  useCurrentSolanaPrice,
} from '../../../../../contexts/liquidityPools';
import {
  UserNFTWithCollection,
  useUserTokens,
} from '../../../../../contexts/userTokens';
import {
  EstimatedRewards,
  ItemContent,
  ModalHeader,
  SubmitButton,
  TotalUSD,
} from '../../../components/ModalParts';
import { SELL_COMMISSION_PERCENT } from '../../../constants';
import { usePoolTokenPrice } from '../../hooks';
import styles from './SellAndStakeModal.module.scss';

import { NftPoolData } from '../../../../../utils/cacher/nftPools';
import { sellNftAndStake } from '../../transactions';

interface SellAndStakeModalProps {
  visible?: boolean;
  pool: NftPoolData;
  poolToken: TokenInfo;
  nft?: UserNFTWithCollection;
  apr?: number;
  inventoryFusionPool: FusionPool;
  onDeselect?: () => void;
}

export const SellAndStakeModal: FC<SellAndStakeModalProps> = ({
  visible = false,
  pool,
  poolToken,
  nft,
  apr = 0,
  onDeselect,
  inventoryFusionPool,
}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { removeTokenOptimistic } = useUserTokens();

  const sellValue = 1 - SELL_COMMISSION_PERCENT / 100;

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const { poolTokenPrice } = usePoolTokenPrice(poolToken);
  const { currentSolanaPriceUSD } = useCurrentSolanaPrice();

  const totalValueUSD =
    sellValue * parseFloat(poolTokenPrice) * currentSolanaPriceUSD;

  const onSubmit = async () => {
    try {
      openLoadingModal();

      //Txn here
      await Promise.resolve(null);

      const stakeResult = await sellNftAndStake({
        wallet,
        connection,
        pool,
        nft,
        poolToken,
        inventoryFusionPool,
      });

      if (!stakeResult) {
        throw new Error('Stake failed');
      }

      removeTokenOptimistic([nft?.mint]);
      onDeselect();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    } finally {
      closeLoadingModal();
    }
  };

  return (
    <>
      <div
        className={classNames({
          [styles.wrapper]: true,
          [styles.visible]: visible,
        })}
      >
        <ModalHeader
          headerText="Sell NFT & Stake"
          slippage={0}
          setSlippage={() => {}}
          showSlippageDropdown={false}
        />

        <ItemContent
          className={styles.itemContent}
          name={nft?.metadata.name}
          image={nft?.metadata.image}
          collectionName={nft?.collectionName}
          onDeselect={() => onDeselect()}
        />

        <TotalUSD className={styles.totalUSD} totalValueUSD={totalValueUSD} />

        <EstimatedRewards
          className={styles.estimatedRewards}
          totalValueUSD={totalValueUSD}
          apr={apr}
        />

        <SubmitButton text="Stake" onClick={() => onSubmit()} />
      </div>
      <LoadingModal
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};
