import { FC } from 'react';
import { Ledger, MathWallet } from '@frakt/icons';
import styles from './WalletModal.module.scss';

interface WalletItemProps {
  onClick: () => void;
  imageSrc: string;
  imageAlt: string;
  name: string;
}

export const WalletItem: FC<WalletItemProps> = ({
  onClick,
  imageSrc,
  imageAlt,
  name,
}) => {
  return (
    <div className={styles.walletItem} onClick={onClick}>
      {/*//?  To prevent same background for white icons */}
      {name === 'Ledger' && <Ledger className={styles.walletIcon} />}
      {name === 'MathWallet' && <MathWallet className={styles.walletIcon} />}
      {name !== 'Ledger' && name !== 'MathWallet' && (
        <img alt={imageAlt} src={imageSrc} />
      )}
      {name}
    </div>
  );
};
