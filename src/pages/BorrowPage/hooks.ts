import { Dictionary } from 'lodash';
import { useState, useMemo, Dispatch, SetStateAction, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useFakeInfinityScroll } from '../../components/FakeInfinityScroll';
import { UserNFT, useUserTokens } from '../../contexts/userTokens';
import { useWalletModal } from '../../contexts/WalletModal';
import {
  DISCOUNT_NFT_CREATORS,
  getNftMarketLowerPricesByCreators,
  LoanData,
  useLoans,
  useLoansInitialFetch,
} from '../../contexts/loans';
import { useDebounce } from '../../hooks';
import { getNftCreators } from '../../utils';

const usePriceByCreator = (creatorsArray = []) => {
  const [priceByCreator, setPriceByCreator] = useState<
    Dictionary<number | null>
  >({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPrices = async (creatorsArray: string[] = []) => {
    try {
      setLoading(true);

      const priceByCreator = await getNftMarketLowerPricesByCreators(
        creatorsArray,
      );

      setPriceByCreator(priceByCreator);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (creatorsArray.length) {
      fetchPrices(creatorsArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatorsArray.length]);

  return {
    priceByCreator,
    loading,
  };
};

export const useBorrowPage = (): {
  isCloseSidebar: boolean;
  setIsCloseSidebar: Dispatch<SetStateAction<boolean>>;
  nfts: UserNFT[];
  setVisible: (nextState: boolean) => void;
  loading: boolean;
  searchItems: (search: string) => void;
  loanData: LoanData;
  priceByCreator: Dictionary<number | null>;
  ltvByCreator: Dictionary<number | null>;
  interestRateDiscountPercent: number;
} => {
  //? Hardcoded util multiple loanPools not implemented
  const loanPoolPubkey = 'FuydvCEeh5sa4YyPzQuoJFBRJ4sF5mwT4rbeaWMi3nuN';

  useLoansInitialFetch();
  const { connected } = useWallet();
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);
  const {
    nfts: rawNfts,
    allNfts: rawNftsWithFrozen,
    loading: userTokensLoading,
    nftsLoading,
    fetchUserNfts,
    rawUserTokensByMint,
  } = useUserTokens();
  const { setItemsToShow } = useFakeInfinityScroll(15);
  const [searchString, setSearchString] = useState<string>('');
  const { setVisible } = useWalletModal();
  const { loanDataByPoolPublicKey, loading: loansLoading } = useLoans();

  useEffect(() => {
    if (
      connected &&
      !userTokensLoading &&
      !nftsLoading &&
      Object.keys(rawUserTokensByMint).length
    ) {
      fetchUserNfts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, userTokensLoading, nftsLoading]);

  const interestRateDiscountPercent = useMemo(() => {
    if (rawNftsWithFrozen?.length && !nftsLoading) {
      const amountOfDiscountNfts = rawNftsWithFrozen.reduce((amount, nft) => {
        const creators = getNftCreators(nft);

        const isDiscountNft = !!DISCOUNT_NFT_CREATORS?.find((creator) =>
          creators.includes(creator),
        );

        if (isDiscountNft) {
          return amount + 1;
        }

        return amount;
      }, 0);

      return amountOfDiscountNfts > 100 ? 100 : amountOfDiscountNfts;
    }

    return 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawNftsWithFrozen?.length, nftsLoading]);

  const searchItems = useDebounce((search: string) => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const loanData = loanDataByPoolPublicKey.get(loanPoolPubkey);

  const loanDataCollectionsCreators = useMemo(() => {
    if (loanDataByPoolPublicKey?.size) {
      return loanData?.collectionsInfo?.map(({ creator }) => creator);
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanDataByPoolPublicKey?.size, loanPoolPubkey]);

  const { priceByCreator, loading: priceByCreatorLoading } = usePriceByCreator(
    loanDataCollectionsCreators,
  );

  const ltvByCreator = useMemo(() => {
    if (
      priceByCreator &&
      !priceByCreatorLoading &&
      loanDataByPoolPublicKey?.size &&
      loanPoolPubkey
    ) {
      return Object.fromEntries(
        loanData?.collectionsInfo?.map(({ creator, loanToValue }) => {
          const ltv = loanToValue / 1e4 || null;

          return [creator, ltv];
        }),
      );
    }

    return {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    priceByCreator,
    priceByCreatorLoading,
    loanDataByPoolPublicKey?.size,
    loanPoolPubkey,
  ]);

  const whitelistedNfts = useMemo(() => {
    if (rawNfts?.length && loanDataByPoolPublicKey?.size) {
      return rawNfts?.filter(({ metadata }) => {
        const isSuitable = metadata?.properties?.creators?.find(
          ({ verified, address }) => {
            if (verified) {
              return loanDataCollectionsCreators.includes(address);
            }

            return false;
          },
        );

        return !!isSuitable;
      });
    }

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawNfts, loanDataByPoolPublicKey?.size]);

  const filteredNfts = useMemo(() => {
    return (whitelistedNfts || [])
      .filter(({ metadata }) =>
        metadata?.name.toUpperCase().includes(searchString),
      )
      .sort(({ metadata: metadataA }, { metadata: metadataB }) =>
        metadataB?.name?.localeCompare(metadataA?.name),
      );
  }, [searchString, whitelistedNfts]);

  const loading =
    userTokensLoading || nftsLoading || loansLoading || priceByCreatorLoading;

  return {
    isCloseSidebar,
    setIsCloseSidebar,
    nfts: filteredNfts,
    setVisible,
    loading: connected ? loading : false,
    searchItems,
    loanData,
    priceByCreator,
    ltvByCreator,
    interestRateDiscountPercent,
  };
};