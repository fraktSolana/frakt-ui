import { FC, ReactNode, useState, FocusEvent, FormEvent } from 'react';
import { AddressType, useNotificationChannel } from '@dialectlabs/react-sdk';

import { Button } from '@frakt/components/Button';

import { AddressInput, RightAddonState } from './AddressInput';
import styles from '../..//NotificationsSider.module.scss';

interface VerificationInputProps {
  description?: string;
  addressType: AddressType;
  onCancel: () => void;
  customText?: ReactNode;
}

const VERIFICATION_CODE_REGEX = '^[0-9]{6}$';

export const VerificationInput: FC<VerificationInputProps> = ({
  addressType,
  onCancel,
  description,
  customText,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [currentError, setCurrentError] = useState<Error | null>(null);
  const { verify: verifyCode, resend } = useNotificationChannel({
    addressType,
  });

  const sendCode = async () => {
    try {
      if (currentError) return;

      await verifyCode({ code: verificationCode });
      setCurrentError(null);
      setVerificationCode('');
    } catch (e) {
      setCurrentError(e as Error);
    }
  };

  const resendCode = async () => {
    try {
      await resend();
      setCurrentError(null);
    } catch (e) {
      setCurrentError(e as Error);
    }
  };

  const onBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
    event.target.checkValidity()
      ? setCurrentError(null)
      : setCurrentError({
          name: 'incorrectCode',
          message: 'Please enter a valid code',
        });
  };

  const onFocus = () => {
    setCurrentError(null);
  };

  const onInvalid = (event: FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    setCurrentError({
      name: 'incorrectCode',
      message: 'Please enter a valid code',
    });
  };

  return (
    <>
      <AddressInput
        id="settings-verification-cide"
        placeholder="Enter verification code"
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        isError={!!currentError}
        onBlur={onBlur}
        onInvalid={onInvalid}
        onFocus={onFocus}
        pattern={VERIFICATION_CODE_REGEX}
        rightAddonProps={{
          state: verificationCode
            ? RightAddonState.SUBMIT
            : RightAddonState.EMPTY,
          onClick: sendCode,
        }}
      />
      {!!currentError?.message && (
        <p className={styles.addressErrorText}>{currentError?.message}</p>
      )}
      {!!customText && customText}
      {!customText && (
        <div className={styles.addressInputDescription}>
          <p className={styles.addressInputDescriptionText}>{description}</p>
          <Button
            onClick={onCancel}
            className={styles.addressInputDescriptionBtn}
          >
            Cancel
          </Button>
          <Button
            onClick={resendCode}
            className={styles.addressInputDescriptionBtn}
          >
            Resend
          </Button>
        </div>
      )}
    </>
  );
};
