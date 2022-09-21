import { FC, useState } from 'react';
import cx from 'classnames';

import { SolanaIcon } from '../../../../icons';
import styles from './SelectedBulkRaw.module.scss';
import Button from '../../../../components/Button';
import Icons from '../../../../iconsNew';

interface SelectedBulkRawProps {
  selectedBulk: any;
  onClick: () => void;
  selectedBulkValue: number;
  onChangeAssetsMode: () => void;
}

const SelectedBulkRaw: FC<SelectedBulkRawProps> = ({
  selectedBulk,
  onClick,
  selectedBulkValue,
  onChangeAssetsMode,
}) => {
  const [activeCardId, setActiveCardId] = useState<number | null>(null);

  const onCardClick = (id: number): void => {
    if (id === activeCardId) {
      setActiveCardId(null);
    } else {
      setActiveCardId(id);
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        className={cx(styles.btnBack, styles.btnWithArrow)}
      >
        <Icons.Arrow />
      </div>
      <div className={styles.sidebar}>
        <p className={styles.sidebarTitle}>To borrow</p>
        <p className={styles.sidebarSubtitle}>
          {selectedBulkValue?.toFixed(2)} SOL
        </p>
        <div className={styles.sidebarBtnWrapper}>
          <Button type="secondary" className={styles.btn}>
            Bulk borrow {selectedBulkValue?.toFixed(2)} SOL
          </Button>
          <Button onClick={onChangeAssetsMode} className={styles.btn}>
            Change asset
          </Button>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Tiltle 1</h1>
            <h2 className={styles.subtitle}>
              {selectedBulk?.length} loans in bulk
            </h2>
          </div>
        </div>
        {selectedBulk.map((nft, id) => (
          <div className={styles.cardWrapper} key={id}>
            <div className={styles.card}>
              <div className={styles.cardInfo}>
                <img className={styles.image} src={nft?.imageUrl} />
                <div className={styles.name}>{nft?.name || ''}</div>
              </div>
              <div className={styles.cardValues}>
                {getStatsValue({
                  title: 'To borrow',
                  value: nft?.maxLoanValue,
                  withIcon: true,
                  className: styles.rowCardValue,
                })}
                <div
                  onClick={() => onCardClick(id)}
                  className={cx(
                    activeCardId === id && styles.btnVisible,
                    styles.btnWithArrow,
                  )}
                >
                  <Icons.Chevron />
                </div>
              </div>
            </div>
            {id === activeCardId && (
              <div className={styles.hiddenValues}>
                {getStatsValue({
                  title: 'Loan Type',
                  value: nft?.isPriceBased ? 'Perpetual' : 'Flip',
                })}
                {getStatsValue({
                  title: 'Loan Type',
                  value: `${nft?.maxLoanValue} %`,
                })}
                {getStatsValue({
                  title: 'Floor price',
                  value: `${nft?.valuation}`,
                  withIcon: true,
                })}
                {getStatsValue({
                  title: 'Liquidations price',
                  value: `${nft?.maxLoanValue}`,
                  withIcon: true,
                })}
                {getStatsValue({
                  title: 'Borrow APY',
                  value: `${nft?.maxLoanValue}`,
                  withIcon: true,
                })}
                {getStatsValue({
                  title: 'Minting fee',
                  value: `${nft?.parameters?.fee}`,
                  withIcon: true,
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default SelectedBulkRaw;

const getStatsValue = ({
  title,
  value,
  withIcon,
  className,
}: {
  title: string;
  value: number | string;
  withIcon?: boolean;
  className?: string;
}) => {
  return (
    <div className={cx(styles.cardValue, className)}>
      <p className={styles.cardTitle}>{title}</p>
      <p className={styles.cardSubtitle}>
        {value} {withIcon && <SolanaIcon />}
      </p>
    </div>
  );
};
