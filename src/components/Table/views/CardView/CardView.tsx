import React from 'react';
import { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';

import { getCardOrRowClassName } from '../../helpers';
import { ActiveRowParams } from '../../types';

import styles from './CardView.module.scss';

interface CardViewProps<T> {
  columns: ColumnsType<T> | any;
  data: ReadonlyArray<T>;
  onRowClick?: (dataItem: T) => void;
  rowKeyField: string;
  className?: string;
  activeRowParams: ActiveRowParams;
}

const CardView = <T extends unknown>({
  data,
  columns: rawColumns,
  onRowClick,
  rowKeyField,
  className,
  activeRowParams,
}: CardViewProps<T>): JSX.Element => {
  const separatedColumns = rawColumns.filter((column) => !!column.united);
  const columns = rawColumns.filter((column) => !column.united);

  return (
    <div className={classNames({ [styles.cardList]: data?.length }, className)}>
      {data?.map((dataRow) => (
        <div
          className={classNames(
            styles.card,
            getCardOrRowClassName(dataRow, activeRowParams, true),
          )}
          onClick={onRowClick ? () => onRowClick(dataRow) : null}
          key={dataRow[rowKeyField]}
        >
          {columns?.map((column, idx: number) => (
            <CardRow {...column} dataRow={dataRow} idx={idx} />
          ))}
          <div className={styles.cardRowGap}>
            {separatedColumns?.map(({ key, render }, idx: number) => (
              <React.Fragment key={idx}>
                {render && render(dataRow[key], dataRow, idx)}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardView;

const CardRow = ({ key, title, render, dataRow, idx }) => (
  <div className={styles.cardRow} key={key}>
    <div className={styles.cardRowTitle}>{title && title()}</div>
    {render && render(dataRow[key], dataRow, idx)}
  </div>
);
