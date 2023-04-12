import { ColumnsType } from 'antd/es/table';

import styles from './CardView.module.scss';

interface CardViewProps<T> {
  columns: ColumnsType<T> | any;
  data: ReadonlyArray<T>;
  onRowClick?: (dataItem: T) => void;
  rowKeyField: string;
}

const CardView = <T extends unknown>({
  data,
  columns,
  onRowClick,
  rowKeyField,
}: CardViewProps<T>): JSX.Element => {
  return (
    <div className={styles.mobileTableView}>
      {data?.map((dataRow) => (
        <div
          className={styles.mobileCollection}
          onClick={onRowClick ? () => onRowClick(dataRow) : null}
          key={dataRow[rowKeyField]}
        >
          {columns?.map(({ key, title, render }, idx) => {
            return (
              <div className={styles.mobileRow} key={key}>
                <div className={styles.mobileRowTitle}>{title && title()}</div>
                {render(dataRow[key], dataRow, idx)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CardView;
