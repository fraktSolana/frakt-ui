import React, { useEffect, useMemo, useState } from 'react';
import { TokenInfo, TokenListProvider } from '@solana/spl-token-registry';

import { TokenListContextInterface } from './tokenList.model';
import {
  ADDITIONAL_SWAPPABLE_TOKENS_MINTS,
  VERIFIED_BY_FRAKT_TEAM_TOKENS_URL,
} from './tokenList.contants';

export const TokenListContext = React.createContext<TokenListContextInterface>({
  tokensList: [],
  tokensMap: new Map<string, TokenInfo>(),
  fraktionTokensList: [],
  fraktionTokensMap: new Map<string, TokenInfo>(),
  loading: true,
});

export const TokenListContextProvider = ({
  children = null,
}: {
  children: JSX.Element | null;
}): JSX.Element => {
  const [tokensList, setTokensList] = useState<TokenInfo[]>([]);
  const [fraktionTokensList, setFraktionTokensList] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      fetch(VERIFIED_BY_FRAKT_TEAM_TOKENS_URL).then((res) => res.json()),
      new TokenListProvider()
        .resolve()
        .then((tokens) => tokens.filterByClusterSlug('mainnet-beta').getList()),
    ])
      .then(([fraktList, solanaList]) => {
        setTokensList([...fraktList, ...solanaList]);
        setFraktionTokensList(fraktList);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  //? Token map for quick lookup.
  const tokensMap = useMemo(() => {
    const tokenMap = new Map();
    tokensList.forEach((token: TokenInfo) => {
      tokenMap.set(token.address, token);
    });
    return tokenMap;
  }, [tokensList]);

  //? Fraktion map for quick lookup.
  const fraktionTokensMap = useMemo(() => {
    const fraktionTokensMap = new Map();
    fraktionTokensList.forEach((token: TokenInfo) => {
      fraktionTokensMap.set(token.address, token);
    });

    if (fraktionTokensMap.size) {
      ADDITIONAL_SWAPPABLE_TOKENS_MINTS.forEach((mint) => {
        const token: TokenInfo = tokensMap.get(mint);
        if (token) {
          fraktionTokensMap.set(mint, tokensMap.get(mint));
        }
      });
    }

    return fraktionTokensMap;
  }, [fraktionTokensList, tokensMap]);

  return (
    <TokenListContext.Provider
      value={{
        tokensMap,
        loading,
        tokensList,
        fraktionTokensList,
        fraktionTokensMap,
      }}
    >
      {children}
    </TokenListContext.Provider>
  );
};
