import { FC } from 'react';

import Table, { useTable, PartialBreakpoints } from '@frakt/components/Table';
import { useWallet } from '@solana/wallet-adapter-react';
import { BondHistory } from '@frakt/api/bonds';

import { COLUMNS } from './columns';

import styles from './TableCells/TableCells.module.scss';

export interface BondsTableProps {
  data: ReadonlyArray<BondHistory>;
  loading?: boolean;
  className?: string;
  breakpoints?: PartialBreakpoints;
}

export const HistoryTable: FC<BondsTableProps> = ({
  data,
  loading,
  className,
  breakpoints,
}) => {
  const { publicKey } = useWallet();
  const { table, search } = useTable({
    data,
    columns: COLUMNS,
    loading,
  });

  return (
    <Table
      {...table}
      search={search}
      className={className}
      breakpoints={breakpoints}
      activeRowParams={{
        field: 'ownerPubkey',
        value: publicKey?.toBase58(),
        className: styles.activeRow,
      }}
    />
  );
};
