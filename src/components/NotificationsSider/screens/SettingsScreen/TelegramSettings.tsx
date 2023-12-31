import { FC } from 'react';
import { AddressType } from '@dialectlabs/react-sdk';

import Button from '@frakt/components/Button';

import { VerificationInput } from './VerificationInput';
import { AddressInput, generateRightAddonProps } from './AddressInput';
import { useAddressSettings, useDialectTelegramBotURL } from './hooks';
import { AddressInputBottomContent } from './AddressInputBottomContent';
import styles from '../..//NotificationsSider.module.scss';

export const TelegramSettings: FC = () => {
  const ADDRESS_TYPE = AddressType.Telegram;

  const {
    currentValue,
    onCurrentValueChange,
    isLoading,
    isEditing,
    isDeleting,
    isAddressSaved,
    isVerified,
    createAddress,
    updateAddress,
    onUpdateCancel,
    onDeleteStart,
    deleteAddress,
    onDeleteCancel,
    error,
    setError,
    isSubscriptionEnabled,
    toggleSubscription,
  } = useAddressSettings({
    addressType: ADDRESS_TYPE,
  });

  const telegramValueFormatter = (value: string) => value.replace('@', '');

  const rightAddonProps = generateRightAddonProps({
    currentValue,
    isLoading,
    isEditing,
    isDeleting,
    isSaved: isAddressSaved,
    onCreate: () => createAddress({ formatter: telegramValueFormatter }),
    onUpdate: () => updateAddress({ formatter: telegramValueFormatter }),
    onDeleteStart,
    onDeleteConfirm: deleteAddress,
  });

  const botURL = useDialectTelegramBotURL();

  const onFocus = () => {
    setError(null);
  };

  return (
    <div className={styles.addressSettings}>
      <p className={styles.addressSettingsLabel}>Telegram</p>

      {isAddressSaved && !isVerified ? (
        <VerificationInput
          onCancel={deleteAddress}
          addressType={ADDRESS_TYPE}
          customText={
            <div className={styles.addressInputDescription}>
              <p className={styles.addressInputDescriptionText}>
                Get verification code by starting
                <br />
                <a href={botURL} target="_blank" rel="noreferrer">
                  this bot
                </a>{' '}
                with command: /start
              </p>
              <Button
                onClick={deleteAddress}
                className={styles.addressInputDescriptionBtn}
              >
                Cancel
              </Button>
            </div>
          }
        />
      ) : (
        <AddressInput
          placeholder="@"
          value={currentValue}
          onChange={onCurrentValueChange}
          isError={!!error}
          onFocus={onFocus}
          rightAddonProps={rightAddonProps}
        />
      )}
      <AddressInputBottomContent
        {...{
          updateWarningMessage:
            "Updating your telegram handle here will update it across all dapps you've signed up.",
          deleteWarningMessage:
            "Deleting your telegram handle here will delete it across all dapps you've signed up.",
          error,
          isLoading,
          isEditing,
          isDeleting,
          isAddressSaved,
          isVerified,
          isSubscriptionEnabled,
          toggleSubscription,
          onUpdateCancel,
          onDeleteCancel,
        }}
      />
    </div>
  );
};
