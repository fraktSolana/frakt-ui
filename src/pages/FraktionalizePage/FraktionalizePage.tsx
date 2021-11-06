import React, { useMemo, useState } from 'react';

import Button from '../../components/Button';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import NFTCheckbox from '../../components/NFTCheckbox';
import { SearchInput } from '../../components/SearchInput';
import { useUserTokens } from '../../contexts/userTokens';
import { UserNFT } from '../../contexts/userTokens/userTokens.model';
import { useWallet } from '../../external/contexts/wallet';
import Sidebar from './Sidebar';
import styles from './styles.module.scss';
import { useFraktion } from '../../contexts/fraktion/fraktion.context';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll';
import { useDebounce } from '../../hooks';
import FraktionalizeTransactionModal from '../../components/FraktionalizeTransactionModal';

const useFraktionalizeTransactionModal = () => {
  const { refetch: refetchTokens } = useUserTokens();
  const { fraktionalize, refetch: refetchVaults } = useFraktion();
  const [visible, setVisible] = useState<boolean>(false);
  const [state, setState] = useState<'loading' | 'success' | 'fail'>('loading');
  const [lastTxnData, setLastTxnData] = useState<{
    tokenMint?: string;
    pricePerFraction?: number;
    fractionsAmount?: number;
    token?: 'SOL' | 'FRKT';
  }>({});
  const [fractionTokenMint, setFractionTokenMint] = useState<string>('');

  const open = (
    tokenMint: string,
    pricePerFraction: number,
    fractionsAmount: number,
  ) => {
    setVisible(true);
    runTransaction(tokenMint, pricePerFraction, fractionsAmount);
  };

  const runTransaction = async (
    tokenMint: string,
    pricePerFraction: number,
    fractionsAmount: number,
  ) => {
    const result = await fraktionalize(
      tokenMint,
      pricePerFraction,
      fractionsAmount,
      'SOL',
    );

    setLastTxnData({
      tokenMint,
      pricePerFraction,
      fractionsAmount,
      token: 'SOL',
    });

    if (!result) {
      setState('fail');
    } else {
      setState('success');
      setFractionTokenMint(result.fractionalMint);
      refetchTokens();
      refetchVaults();
    }
  };

  const retry = async () => {
    const result = await fraktionalize(
      lastTxnData.tokenMint,
      lastTxnData.pricePerFraction,
      lastTxnData.fractionsAmount,
      lastTxnData.token,
    );

    if (!result) {
      setState('fail');
    } else {
      setState('success');
      setFractionTokenMint(result.fractionalMint);
      refetchTokens();
      refetchVaults();
    }
  };

  const close = () => {
    setLastTxnData({});
    setVisible(false);
    setFractionTokenMint('');
  };

  return {
    visible,
    open,
    close,
    state,
    setState,
    retry,
    fractionTokenMint,
  };
};

const FraktionalizePage = (): JSX.Element => {
  const [search, setSearch] = useState('');
  const { connected, select } = useWallet();
  const { nfts: rawNfts, loading } = useUserTokens();
  const [searchString, setSearchString] = useState<string>('');
  const [selectedNft, setSelectedNft] = useState<UserNFT>(null);
  const {
    visible: txnModalVisible,
    open: openTxnModal,
    close: closeTxnModal,
    state: txnModalState,
    setState: setTxnModalState,
    retry: retryTxn,
    fractionTokenMint,
  } = useFraktionalizeTransactionModal();
  const { itemsToShow, next, setItemsToShow } = useFakeInfinityScroll(15);

  const searchItems = useDebounce((search: string) => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const clearSelectedToken = () => setSelectedNft(null);

  const onCardClick = (nft: UserNFT): void => {
    selectedNft?.mint === nft.mint ? setSelectedNft(null) : setSelectedNft(nft);
  };

  const runFraktionalization = (
    tokenMint: string,
    pricePerFraction: number,
    fractionsAmount: number,
  ) => {
    openTxnModal(tokenMint, pricePerFraction, fractionsAmount);
    setSelectedNft(null);
  };

  const nfts = useMemo(() => {
    return rawNfts.filter(({ metadata }) =>
      metadata.name.toUpperCase().includes(searchString),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString, rawNfts]);

  const onTransactionModalCancel = () => {
    closeTxnModal();
    setTxnModalState('loading');
  };

  return (
    <AppLayout className={styles.positionRelative}>
      <Sidebar
        token={selectedNft}
        onRemoveClick={clearSelectedToken}
        onContinueClick={runFraktionalization}
      />
      <Container component="main" className={styles.contentWrapper}>
        <div id="content-reducer" className={styles.contentReducer}>
          <h4 className={styles.title}>Select your NFT</h4>
          <SearchInput
            value={search}
            size="large"
            onChange={(e) => {
              setSearch(e.target.value || '');
              searchItems(e.target.value || '');
            }}
            className={styles.search}
            placeholder="Search by NFT name"
          />
          {!connected ? (
            <Button
              type="secondary"
              className={styles.connectBtn}
              onClick={select}
            >
              Connect wallet
            </Button>
          ) : (
            <FakeInfinityScroll
              itemsToShow={itemsToShow}
              next={next}
              isLoading={loading}
              wrapperClassName={styles.artsList}
              emptyMessage="No suitable NFTs found"
            >
              {nfts.map((token) => (
                <NFTCheckbox
                  key={token.mint}
                  onClick={() => onCardClick(token)}
                  imageUrl={token.metadata.image}
                  name={token.metadata.name}
                  selected={selectedNft?.mint === token.mint}
                />
              ))}
            </FakeInfinityScroll>
          )}
        </div>
      </Container>
      <FraktionalizeTransactionModal
        visible={txnModalVisible}
        onCancel={onTransactionModalCancel}
        fractionsMintAddress={fractionTokenMint}
        onRetryClick={retryTxn}
        state={txnModalState}
      />
    </AppLayout>
  );
};

export default FraktionalizePage;
