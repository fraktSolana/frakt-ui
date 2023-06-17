import { FC, FocusEvent, FormEvent } from 'react';
import { AddressType } from '@dialectlabs/react-sdk';

import { VerificationInput } from './VerificationInput';
import { AddressInput, generateRightAddonProps } from './AddressInput';
import { useAddressSettings } from './hooks';
import { AddressInputBottomContent } from './AddressInputBottomContent';
import styles from '../..//NotificationsSider.module.scss';

export const SmsSettings: FC = () => {
  const ADDRESS_TYPE = AddressType.PhoneNumber;

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

  const rightAddonProps = generateRightAddonProps({
    currentValue,
    isLoading,
    isEditing,
    isDeleting,
    isSaved: isAddressSaved,
    onCreate: createAddress,
    onUpdate: updateAddress,
    onDeleteStart,
    onDeleteConfirm: deleteAddress,
  });

  const onBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
    event.target.checkValidity()
      ? setError(null)
      : setError({
          name: 'incorrectPhone',
          message: 'Please enter a valid phone',
        });
  };

  const onFocus = () => {
    setError(null);
  };

  const onInvalid = (event: FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    setError({
      name: 'incorrectPhone',
      message: 'Please enter a valid phone',
    });
  };

  return (
    <div className={styles.addressSettings}>
      <p className={styles.addressSettingsLabel}>Sms</p>

      {isAddressSaved && !isVerified ? (
        <VerificationInput
          description="Check sms for verification code."
          onCancel={deleteAddress}
          addressType={ADDRESS_TYPE}
        />
      ) : (
        <AddressInput
          placeholder="+15554443333 (country code required)"
          type="tel"
          value={currentValue}
          onChange={onCurrentValueChange}
          isError={!!error}
          onBlur={onBlur}
          onFocus={onFocus}
          onInvalid={onInvalid}
          rightAddonProps={rightAddonProps}
        />
      )}
      <AddressInputBottomContent
        {...{
          updateWarningMessage:
            "Updating your sms number here will update it across all dapps you've subscribed to.",
          deleteWarningMessage:
            "Deleting your sms number here will delete it for all dapps you've subscribed to.",
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
