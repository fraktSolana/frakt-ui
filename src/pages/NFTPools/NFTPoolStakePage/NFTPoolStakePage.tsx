import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import { FC } from 'react';

import { Loader } from '../../../components/Loader';
import { POOL_TABS } from '../../../constants';
import { formatNumberWithSpaceSeparator } from '../../../contexts/liquidityPools';
import { useNftPoolsInitialFetch } from '../../../contexts/nftPools';
import { usePublicKeyParam } from '../../../hooks';
import { useSplTokenBalance } from '../../../utils/accounts';
import { NFTPoolPageLayout } from '../components/NFTPoolPageLayout';
import { useAPR, usePoolPubkeyParam, usePoolTokensPrices } from '../hooks';
import { HeaderInfo } from '../NFTPoolInfoPage/components/HeaderInfo';
import {
  RewardsInfo,
  StakingDetails,
  StakingInfo,
  WalletInfo,
} from './components';
import { useNftPoolStakePage } from './hooks';
import styles from './NFTPoolStakePage.module.scss';

const usePoolTokenPrice = (poolTokenInfo: TokenInfo) => {
  const { pricesByTokenMint: poolTokenPricesByTokenMint, loading } =
    usePoolTokensPrices([poolTokenInfo]);

  return {
    loading,
    poolTokenPrice: poolTokenPricesByTokenMint.get(poolTokenInfo?.address)?.buy,
  };
};

export const NFTPoolStakePage: FC = () => {
  const poolPubkey = usePoolPubkeyParam();
  usePublicKeyParam(poolPubkey);
  useNftPoolsInitialFetch();

  const { connected } = useWallet();

  const {
    pool,
    poolTokenInfo,
    userNfts,
    // raydiumPoolInfo,
    inventoryFusionPool,
    liquidityFusionPool,
    pageLoading: pageLoadingNftPool,
    contentLoading: contentLoadingNftPool,
  } = useNftPoolStakePage(poolPubkey);

  const { inverntoryAPR, liquidityAPR, raydiumPoolLiquidityUSD } =
    useAPR(poolTokenInfo);

  const { poolTokenPrice, loading: poolTokenPriceLoading } =
    usePoolTokenPrice(poolTokenInfo);

  const inventoryTotalLiquidity =
    Number(poolTokenPrice) *
      Number(inventoryFusionPool?.router?.amountOfStaked) || 0;

  const { balance: poolTokenBalance } = useSplTokenBalance(
    inventoryFusionPool?.router?.tokenMintInput,
    9,
  );

  const { balance: lpTokenBalance } = useSplTokenBalance(
    liquidityFusionPool?.router?.tokenMintInput,
    9,
  );

  const pageLoading = pageLoadingNftPool;
  const contentLoading = contentLoadingNftPool || poolTokenPriceLoading;

  return (
    <NFTPoolPageLayout
      customHeader={
        <HeaderInfo
          pool={pool}
          poolTokenInfo={poolTokenInfo}
          hidden={pageLoading}
        />
      }
      tab={POOL_TABS.STAKE}
    >
      {contentLoading ? (
        <Loader size="large" />
      ) : (
        <div className={styles.root}>
          <div className={styles.stakingWrapper}>
            <StakingDetails
              className={styles.stakingInfoInventory}
              title="Inventory Staking"
              infoText="Stake pool tokens without any risk but with reduced rewards"
              totalLiquidity={`$ ${formatNumberWithSpaceSeparator(
                inventoryTotalLiquidity || 0,
              )}`}
              apr={`${inverntoryAPR.toFixed(2)} %`}
            />
            <StakingDetails
              className={styles.stakingInfoLiquidity}
              title="Liquidity Staking"
              infoText="Stake LP tokens with high rewards but with risk of impermanent
              loss"
              totalLiquidity={`$ ${formatNumberWithSpaceSeparator(
                raydiumPoolLiquidityUSD || 0,
              )}`}
              apr={`${liquidityAPR.toFixed(2)} %`}
              isRisky
            />
            {connected && (
              <>
                <InventoryWalletInfo
                  poolToken={{
                    ticker: poolTokenInfo?.symbol,
                    balance: poolTokenBalance,
                  }}
                  onSellNft={() => {}}
                  sellNftAvailable={!!userNfts?.length}
                  className={styles.inventoryWalletInfo}
                />
                <LiquidityWalletInfo
                  poolToken={{
                    ticker: poolTokenInfo?.symbol,
                    balance: poolTokenBalance,
                  }}
                  lpToken={{
                    ticker: `${poolTokenInfo?.symbol}/SOL`,
                    balance: lpTokenBalance,
                  }}
                  onSellNft={() => {}}
                  sellNftAvailable={!!userNfts?.length}
                  className={styles.liquidityWalletInfo}
                />
                <p
                  className={classNames(
                    styles.subtitle,
                    styles.subtitleStaking,
                  )}
                >
                  Staking info
                </p>
                <StakingInfo className={styles.stakingInfo} />
                <RewardsInfo
                  className={styles.rewardsInfo}
                  values={['10 PUNKS', '20 rFRKT', '20 rFRKT']}
                />
              </>
            )}
          </div>
        </div>
      )}
    </NFTPoolPageLayout>
  );
};

interface InventoryWalletInfoProps {
  poolToken: {
    ticker: string;
    balance: number;
  };
  sellNftAvailable?: boolean;
  onSellNft: () => void;
  className?: string;
}

const InventoryWalletInfo: FC<InventoryWalletInfoProps> = ({
  poolToken,
  sellNftAvailable = false,
  onSellNft,
  className,
}) => {
  return (
    <div className={className}>
      <p className={styles.subtitle}>Wallet info</p>
      <WalletInfo
        title={poolToken?.ticker || 'Unknown'}
        balance={poolToken?.balance ? poolToken.balance.toFixed(3) : '0'}
        firstAction={{ label: 'Stake rPWNG', action: () => {} }}
        secondAction={
          sellNftAvailable
            ? { label: 'Sell NFT & Stake', action: onSellNft }
            : null
        }
        className={styles.walletInfoInventory}
      />
    </div>
  );
};

interface LiquidityWalletInfoProps {
  poolToken: {
    ticker: string;
    balance: number;
  };
  lpToken?: {
    ticker: string;
    balance: number;
  };
  sellNftAvailable?: boolean;
  onSellNft: () => void;
  className?: string;
}

const LiquidityWalletInfo: FC<LiquidityWalletInfoProps> = ({
  poolToken,
  lpToken,
  sellNftAvailable = false,
  onSellNft,
  className,
}) => {
  return (
    <div className={classNames(styles.liquidityWalletInfoMain, className)}>
      <p className={classNames(styles.liquiditySubtitle, styles.subtitle)}>
        Wallet info
      </p>
      <WalletInfo
        title={poolToken?.ticker || 'Unknown'}
        balance={poolToken?.balance ? poolToken.balance.toFixed(3) : '0'}
        firstAction={{ label: 'Deposit', action: () => {} }}
        secondAction={
          sellNftAvailable
            ? { label: 'Sell NFT & Deposit', action: onSellNft }
            : null
        }
        className={styles.walletInfoLiquidity}
      />
      {!!lpToken && (
        <WalletInfo
          title={lpToken.ticker || 'Unknown'}
          balance={lpToken.balance ? lpToken.balance.toFixed(3) : '0'}
          firstAction={{ label: 'Stake', action: () => {} }}
          secondAction={{ label: 'Withdraw', action: () => {} }}
          className={styles.walletInfoLiquidityStaking}
        />
      )}
    </div>
  );
};
