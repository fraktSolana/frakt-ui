import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { selectSelectedNftId } from '../../../../state/common/selectors';
import {
  selectBulkNfts,
  selectPerpLoansNfts,
} from '../../../../state/loans/selectors';
import { LinkWithArrow } from '../../../../components/LinkWithArrow';
import { AppLayout } from '../../../../components/Layout/AppLayout';
import InfinityScroll from '../../../../components/InfinityScroll';
import { SearchInput } from '../../../../components/SearchInput';
import { loansActions } from '../../../../state/loans/actions';
import NFTCheckbox from '../../../../components/NFTCheckbox';
import { BorrowNft } from '../../../../state/loans/types';
import styles from './BorrowNft.module.scss';
import {
  SelectLayout,
  useSelectLayout,
} from '../../../../components/SelectLayout';
import { useBorrowPage } from '../../hooks';
import SelectedBulk from '../SelectedBulk';
import BorrowForm from '../BorrowForm';
import { BorrowFormType } from '../BorrowForm/BorrowForm';
import Header from '../Header';

const ACCEPTED_FOR_LOANS_COLLECTIONS_LINK =
  'https://docs.frakt.xyz/frakt/loans/collections-accepted-for-loans';

interface BorrowNftProps {
  onClick: () => void;
}

const BorrowNft: FC<BorrowNftProps> = ({ onClick }) => {
  const dispatch = useDispatch();
  const {
    connected,
    onDeselect,
    onMultiSelect,
    selectedNfts,
    setSelectedNfts,
  } = useSelectLayout();

  const {
    isCloseSidebar,
    nfts,
    setSearch,
    searchItems,
    search,
    next,
    loading,
  } = useBorrowPage();

  const perpetualNftsInfo = useSelector(selectPerpLoansNfts);
  const selectedNftId = useSelector(selectSelectedNftId);
  const bulkNftsRaw = useSelector(selectBulkNfts);

  useEffect(() => {
    bulkNftsRaw.length && setSelectedNfts(bulkNftsRaw);
  }, [bulkNftsRaw]);

  const [openBulk, setOpenBulk] = useState<boolean>(false);

  const currentId = selectedNftId > selectedNfts.length - 1 ? 0 : selectedNftId;
  const isBulkLoan = selectedNfts.length > 1;

  const bulkNfts = selectedNfts.map((nft: any) => {
    if (!nft?.priceBased) {
      return { ...nft };
    } else {
      const { valuation, timeBased, priceBased } = nft;

      const currentNft = perpetualNftsInfo.find(
        ({ mint }) => mint === nft?.mint,
      );

      const ltv =
        currentNft?.ltv ||
        Number(
          ((priceBased.suggestedLoanValue / valuation) * 100).toFixed(0),
        ) ||
        25;

      const maxLoanValuePriceBased = (
        parseFloat(valuation) *
        (ltv / 100)
      )?.toFixed(3);

      const isPriceBased = currentNft?.formType === BorrowFormType.PERPETUAL;

      const maxLoanValue = isPriceBased
        ? maxLoanValuePriceBased
        : timeBased?.loanValue;

      const priceBasedFee = Number(maxLoanValuePriceBased) * 0.01;
      const fee = isPriceBased ? timeBased.fee : priceBasedFee.toFixed(3);

      return {
        ...nft,
        maxLoanValue,
        priceBased: { ...priceBased, fee, ltv },
        isPriceBased: currentNft?.ltv ? isPriceBased : true,
      };
    }
  });

  const allPerpetualLoans = selectedNfts.filter(({ priceBased }) => priceBased);

  useEffect(() => {
    dispatch(loansActions.addPerpLoanNft(allPerpetualLoans));
  }, [dispatch]);

  return (
    <>
      {!openBulk && (
        <SelectLayout
          selectedNfts={selectedNfts}
          onDeselect={onDeselect}
          isCloseSidebar={isCloseSidebar}
          sidebarForm={
            <BorrowForm
              onClick={() => setOpenBulk(true)}
              selectedNft={bulkNfts?.[currentId]}
              onDeselect={onDeselect}
              isBulkLoan={isBulkLoan}
            />
          }
        >
          <Header
            onClick={onClick}
            title="Borrow SOL"
            subtitle="Select your NFT to use as a collateral"
            className={selectedNfts.length && styles.headerActive}
          />

          <div className={styles.sortWrapper}>
            <SearchInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value || '');
                searchItems(e.target.value || '');
              }}
              className={styles.searchInput}
              placeholder="Search by name"
            />
          </div>

          {connected && !loading && !nfts.length && (
            <div className={styles.noSuiableMessageWrapper}>
              <p className={styles.noSuiableMessage}>No suitable NFTs found</p>
              <LinkWithArrow
                className={styles.acceptedCollectionsLink}
                label="Check collections accepted for loans"
                to={ACCEPTED_FOR_LOANS_COLLECTIONS_LINK}
                externalLink
              />
            </div>
          )}

          {connected && (
            <InfinityScroll
              itemsToShow={nfts.length}
              next={next}
              wrapperClassName={classNames(
                styles.nftsList,
                !selectedNfts.length && styles.nftListActive,
              )}
              isLoading={loading}
              emptyMessage=""
              customLoader={<p className={styles.loader}>loading your jpegs</p>}
            >
              {(nfts as BorrowNft[]).map((nft) => {
                return (
                  <NFTCheckbox
                    key={nft.mint}
                    onClick={() => onMultiSelect(nft)}
                    imageUrl={nft.imageUrl}
                    name={nft.name}
                    selected={
                      !!selectedNfts.find(
                        (selectedNft) => selectedNft?.mint === nft.mint,
                      )
                    }
                    isCanStake={
                      nft.timeBased?.isCanStake || nft.priceBased?.isCanStake
                    }
                    isCanFreeze={nft.isCanFreeze}
                    loanValue={nft.maxLoanValue}
                  />
                );
              })}
            </InfinityScroll>
          )}
        </SelectLayout>
      )}
      {openBulk && (
        <AppLayout>
          <SelectedBulk
            onClick={() => setOpenBulk(false)}
            selectedBulk={bulkNfts}
          />
        </AppLayout>
      )}
    </>
  );
};

export default BorrowNft;
