import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import Button from '@frakt/components/Button';
import { useWalletModal } from '@frakt/components/WalletModal';

import styles from './OfferActionButtons.module.scss';

interface OfferActionButtonsProps {
  isEdit: boolean;
  disablePlaceOffer: boolean;
  disableEditOffer: boolean;
  onCreateOffer: () => Promise<void>;
  onRemoveOffer: () => Promise<void>;
  onEditOffer: () => Promise<void>;
}

const OfferActionButtons: FC<OfferActionButtonsProps> = ({
  isEdit,
  onRemoveOffer,
  onEditOffer,
  disablePlaceOffer,
  disableEditOffer,
  onCreateOffer,
}) => {
  const { connected } = useWallet();
  const { toggleVisibility } = useWalletModal();

  const onToggleWalletModal = () => toggleVisibility();

  const deleteButtonProps = {
    onClick: onRemoveOffer,
    className: classNames(styles.button, styles.deleteOfferButton),
    children: 'Delete offer',
  };

  const updateButtonProps = {
    onClick: onEditOffer,
    className: styles.button,
    type: 'secondary' as const,
    disabled: disableEditOffer,
    children: 'Update offer',
  };

  const placeButtonProps = {
    className: styles.button,
    disabled: disablePlaceOffer,
    onClick: !connected ? onToggleWalletModal : onCreateOffer,
    type: 'secondary' as const,
    children: !connected ? 'Connect wallet' : 'Place',
  };

  return (
    <div className={styles.buttonsWrapper}>
      {isEdit ? (
        <>
          <Button {...deleteButtonProps} />
          <Button {...updateButtonProps} />
        </>
      ) : (
        <Button {...placeButtonProps} />
      )}
    </div>
  );
};

export default OfferActionButtons;
