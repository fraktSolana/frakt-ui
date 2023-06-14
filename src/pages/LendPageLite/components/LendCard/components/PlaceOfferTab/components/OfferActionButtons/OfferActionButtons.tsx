import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import { commonActions } from '@frakt/state/common/actions';
import Button from '@frakt/components/Button';

import styles from './OfferActionButtons.module.scss';

interface OfferActionButtonsProps {
  isEdit: boolean;
  offerSize: number;
  isOfferHasChanged: boolean;
  onCreateOffer: () => Promise<void>;
  onRemoveOffer: () => Promise<void>;
  onEditOffer: () => Promise<void>;
}

const OfferActionButtons: FC<OfferActionButtonsProps> = ({
  isEdit,
  onRemoveOffer,
  onEditOffer,
  offerSize,
  onCreateOffer,
  isOfferHasChanged,
}) => {
  const { connected } = useWallet();
  const dispatch = useDispatch();

  const onToggleWalletModal = () => dispatch(commonActions.toggleWalletModal());

  const deleteButtonProps = {
    onClick: onRemoveOffer,
    className: classNames(styles.button, styles.deleteOfferButton),
    children: 'Delete offer',
  };

  const updateButtonProps = {
    onClick: onEditOffer,
    className: styles.button,
    type: 'secondary' as const,
    disabled: !isOfferHasChanged,
    children: 'Update offer',
  };

  const placeButtonProps = {
    className: styles.button,
    disabled: !offerSize && connected,
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
