import { FC } from 'react';
import classNames from 'classnames';

import Button from '@frakt/components/Button';

import styles from '../BorrowManualTable.module.scss';

interface SelectButtonCellProps {
  isCardView?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export const SelectButtonCell: FC<SelectButtonCellProps> = ({
  isCardView = false,
  selected = false,
  disabled = false,
}) => {
  return (
    <div className={styles.selectBtnWrapper}>
      <Button
        type="secondary"
        className={classNames(styles.selectBtn, {
          [styles.selectBtnFullWidth]: isCardView,
        })}
        disabled={disabled}
      >
        {!selected ? 'Select' : 'Deselect'}
      </Button>
    </div>
  );
};
