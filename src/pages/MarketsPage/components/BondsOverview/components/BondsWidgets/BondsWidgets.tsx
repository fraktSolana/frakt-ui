import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './BondsWidgets.module.scss';

interface BondsWidgetsProps {
  classNames?: string;
  activeLoans: number;
  locked: number;
}

const BondsWidgets: FC<BondsWidgetsProps> = ({ activeLoans, locked }) => {
  const { connected } = useWallet();

  return (
    <div className={styles.wrapper}>
      <WidgetValue
        label="Active loans"
        value={connected ? (activeLoans || 0).toFixed(0) : '--'}
        isSolValue={false}
      />
      <WidgetValue
        label="Locked"
        value={connected ? (locked || 0).toFixed(2) : '--'}
      />
    </div>
  );
};

export default BondsWidgets;

const WidgetValue = ({
  label,
  value,
  isSolValue = true,
}: {
  label: string;
  value: string;
  isSolValue?: boolean;
}): JSX.Element => (
  <div className={styles.block}>
    <div className={styles.values}>
      <p className={styles.label}>{label}:</p>
      {isSolValue && <p className={styles.value}>{value}◎</p>}
      {!isSolValue && <p className={styles.value}>{value}</p>}
    </div>
  </div>
);
