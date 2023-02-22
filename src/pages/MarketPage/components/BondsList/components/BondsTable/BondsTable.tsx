import { FC } from 'react';

import Table, { useTable } from '@frakt/components/Table';
import { Bond, Market, Pair } from '@frakt/api/bonds';

import { TableList } from './columns';

export interface BondsTableProps {
  data: ReadonlyArray<any>;
  market: Market;
  pairs: Pair[];
  onExit: ({ bond, pair }: { bond: Bond; pair: Pair }) => void;
  onRedeem: (bond: Bond) => void;
  sortModalMobileVisible: boolean;
  closeModalMobile: () => void;
  mobileBreakpoint?: number;
}

export const BondsTable: FC<BondsTableProps> = ({
  data,
  market,
  pairs,
  onExit,
  onRedeem,
  sortModalMobileVisible,
  mobileBreakpoint,
  closeModalMobile,
}) => {
  const COLUMNS = TableList({ market, pairs, onExit, onRedeem });

  const { table } = useTable({ data, columns: COLUMNS });

  return (
    <Table
      {...table}
      mobileBreakpoint={mobileBreakpoint}
      sortModalMobileVisible={sortModalMobileVisible}
      closeModalMobile={closeModalMobile}
    />
  );
};
