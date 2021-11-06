import React, { useContext, useEffect, useState } from 'react';
import { keyBy } from 'lodash';
import { PublicKey } from '@solana/web3.js';
import { getAllVaults } from 'fraktionalizer-client-library';

import { useWallet } from '../../external/contexts/wallet';
import { useConnection } from '../../external/contexts/connection';
import {
  fetchVaultsFunction,
  FraktionContextType,
  SafetyBox,
  VaultData,
  VaultsMap,
  VaultState,
} from './fraktion.model';
import { fraktionalize } from './fraktion';
import fraktionConfig from './config';
import { getArweaveMetadataByMint } from '../../utils/getArweaveMetadata';

const FraktionContext = React.createContext<FraktionContextType>({
  loading: false,
  error: null,
  vaults: [],
  fraktionalize: () => Promise.resolve(null),
  refetch: () => Promise.resolve(null),
});

export const FraktionProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { wallet } = useWallet();
  const connection = useConnection();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [vaults, setVaults] = useState<VaultData[]>([]);

  const fetchVaults: fetchVaultsFunction = async () => {
    try {
      setLoading(true);
      const { safetyBoxes: rawSafetyBoxes, vaults: rawVaults } =
        await getAllVaults(
          new PublicKey(fraktionConfig.FRAKTION_PUBKEY),
          connection,
        );

      const nftMints = (rawSafetyBoxes as SafetyBox[]).map(
        ({ tokenMint }) => tokenMint,
      );

      const metadataByMint = await getArweaveMetadataByMint(nftMints);

      const safetyBoxes = rawSafetyBoxes as SafetyBox[];
      const vaultsMap = keyBy(rawVaults, 'vaultPubkey') as VaultsMap;

      const vaultsData: VaultData[] = safetyBoxes.reduce(
        (acc, { vault: vaultPubkey, tokenMint: nftMint }) => {
          const vault = vaultsMap[vaultPubkey];
          const arweaveMetadata = metadataByMint[nftMint];

          if (vault && arweaveMetadata) {
            const { name, image, attributes } = arweaveMetadata;
            const {
              authority,
              fractionMint,
              fractionsSupply,
              lockedPricePerShare,
              priceMint,
              state,
            } = vault;

            const vaultData: VaultData = {
              fractionMint,
              authority,
              supply: fractionsSupply,
              lockedPricePerFraction: lockedPricePerShare,
              priceTokenMint: priceMint,
              publicKey: vaultPubkey,
              state: VaultState[state],
              nftMint,
              name,
              imageSrc: image,
              nftAttributes: attributes,
            };

            return [...acc, vaultData];
          }

          return acc;
        },
        [],
      );

      setVaults(vaultsData);

      return vaultsData;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connection && fetchVaults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  return (
    <FraktionContext.Provider
      value={{
        loading,
        error,
        vaults,
        fraktionalize: (tokenMint, pricePerFraction, fractionsAmount, token) =>
          fraktionalize(
            tokenMint,
            pricePerFraction,
            fractionsAmount,
            token,
            wallet,
            connection,
          ),
        refetch: fetchVaults,
      }}
    >
      {children}
    </FraktionContext.Provider>
  );
};

export const useFraktion = (): FraktionContextType => {
  const {
    loading,
    error,
    vaults,
    fraktionalize,
    refetch: fetchVaults,
  } = useContext(FraktionContext);
  return {
    loading,
    error,
    vaults,
    fraktionalize,
    refetch: fetchVaults,
  };
};
