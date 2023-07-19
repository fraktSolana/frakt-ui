import { ColumnsType, ColumnType } from 'antd/es/table';

import { LoanDuration } from '@frakt/api/nft';
import {
  createPercentValueJSX,
  createSolValueJSX,
  HeaderCell,
} from '@frakt/components/TableComponents';
import { calcPriceBasedUpfrontFee } from '@frakt/pages/BorrowPages/helpers';

import {
  InterestValueCell,
  NftInfoCell,
  RepayValueCell,
  SelectButtonCell,
} from './BorrowManualTableCells';
import { BorrowNftData } from './BorrowManualTable';

type GetTableColumns = (props: {
  duration: LoanDuration;
  isCardView: boolean;
}) => ColumnsType<BorrowNftData>;

export const getTableColumns: GetTableColumns = ({
  duration,
  isCardView = false,
}) => {
  const isPerpetual = duration === '0';

  const NAME_COLUMN: ColumnType<BorrowNftData> = {
    key: 'name',
    dataIndex: 'name',
    title: (column) => (
      <HeaderCell
        fixedLeft
        column={column}
        label="Name"
        value="name"
        hiddenSort
      />
    ),
    render: (_, { nft, selected }) => (
      <NftInfoCell
        nftName={nft.name}
        nftImage={nft.imageUrl}
        selected={selected}
      />
    ),
    sorter: true,
    showSorterTooltip: false,
  };

  const FLOOR_PRICE_COLUMN: ColumnType<BorrowNftData> = {
    key: 'valuation',
    dataIndex: 'valuation',
    title: (column) => (
      <HeaderCell
        column={column}
        label="Floor price"
        value="valuation"
        hiddenSort
      />
    ),
    render: (_, { nft }) => {
      return createSolValueJSX(
        isPerpetual ? nft.valuation : nft.bondParams.floorPrice,
      );
    },
    showSorterTooltip: false,
  };

  const LOAN_VALUE_BONDS_COLUMN: ColumnType<BorrowNftData> = {
    key: 'maxLoanValue',
    dataIndex: 'maxLoanValue',
    title: (column) => (
      <HeaderCell
        column={column}
        label="Borrow"
        value="maxLoanValue"
        hiddenSort
      />
    ),
    sorter: true,
    render: (_, { bondLoanValue }) => createSolValueJSX(bondLoanValue),
    showSorterTooltip: false,
  };

  const LOAN_VALUE_PERPETUAL_COLUMN: ColumnType<BorrowNftData> = {
    key: 'maxLoanValue',
    dataIndex: 'maxLoanValue',
    title: (column) => (
      <HeaderCell
        column={column}
        label="Borrow"
        value="maxLoanValue"
        hiddenSort
      />
    ),
    sorter: true,
    render: (_, { nft }) => {
      const { valuation, classicParams } = nft;
      const maxBorrowValuePriceBased =
        valuation * (classicParams?.priceBased?.ltvPercent / 100);

      return createSolValueJSX(maxBorrowValuePriceBased);
    },

    showSorterTooltip: false,
  };

  const INTEREST_COLUMN: ColumnType<BorrowNftData> = {
    key: 'interest',
    dataIndex: 'fee',
    title: (column) => (
      <HeaderCell column={column} label="Fee" value="interest" hiddenSort />
    ),
    render: (_, { bondFee, bondLoanValue }) => (
      <InterestValueCell bondFee={bondFee} bondLoanValue={bondLoanValue} />
    ),
  };

  const REPAY_VALUE_COLUMN: ColumnType<BorrowNftData> = {
    key: 'repayValue',
    dataIndex: 'repayValue',
    title: (column) => (
      <HeaderCell column={column} label="Repay" value="repayValue" hiddenSort />
    ),
    render: (_, { bondLoanValue, bondFee }) => (
      <RepayValueCell
        repayValue={bondLoanValue + bondFee}
        duration={parseInt(duration)}
      />
    ),
  };

  const YEARLY_INTEREST_COLUMN: ColumnType<BorrowNftData> = {
    key: 'yearlyInterest',
    dataIndex: 'yearlyInterest',
    title: (column) => (
      <HeaderCell
        column={column}
        label="Yearly fee"
        value="interest"
        hiddenSort
      />
    ),
    render: (_, { nft }) => {
      const { borrowAPRPercent } = nft.classicParams.priceBased;
      return createPercentValueJSX(borrowAPRPercent);
    },
  };

  const UPFRONT_FEE_COLUMN: ColumnType<BorrowNftData> = {
    key: 'fee',
    dataIndex: 'fee',
    title: (column) => (
      <HeaderCell column={column} label="Upfront fee" value="fee" hiddenSort />
    ),
    render: (_, { nft }) => {
      const { valuation, classicParams } = nft;
      const maxBorrowValuePriceBased =
        valuation * (classicParams?.priceBased?.ltvPercent / 100);

      return createSolValueJSX(
        calcPriceBasedUpfrontFee({
          loanValue: maxBorrowValuePriceBased,
        }),
      );
    },
  };

  const LIQUIDATION_PRICE_COLUMN: ColumnType<BorrowNftData> = {
    key: 'liquidationPrice',
    dataIndex: 'liquidationPrice',
    title: (column) => (
      <HeaderCell
        column={column}
        label="Liquidation Price"
        value="liquidationPrice"
        hiddenSort
      />
    ),
    render: (_, { nft }) => {
      const { valuation, classicParams } = nft;

      const maxBorrowValuePriceBased =
        valuation * (classicParams?.priceBased?.ltvPercent / 100);

      const { collaterizationRate } = nft.classicParams.priceBased;

      const liquidationPrice =
        maxBorrowValuePriceBased +
        maxBorrowValuePriceBased * (collaterizationRate / 100);

      return createSolValueJSX(liquidationPrice);
    },
  };

  const SELECT_COLUMN: ColumnType<BorrowNftData> = {
    render: (_, { bondLoanValue, selected }) => (
      <SelectButtonCell
        selected={selected}
        isCardView={isCardView}
        disabled={!bondLoanValue && duration !== '0'}
      />
    ),
  };

  return [
    NAME_COLUMN,
    FLOOR_PRICE_COLUMN,
    !isPerpetual ? LOAN_VALUE_BONDS_COLUMN : null,
    isPerpetual ? LOAN_VALUE_PERPETUAL_COLUMN : null,
    !isPerpetual ? INTEREST_COLUMN : null,
    !isPerpetual ? REPAY_VALUE_COLUMN : null,
    isPerpetual ? YEARLY_INTEREST_COLUMN : null,
    isPerpetual ? UPFRONT_FEE_COLUMN : null,
    isPerpetual ? LIQUIDATION_PRICE_COLUMN : null,
    SELECT_COLUMN,
  ].filter(Boolean);
};
