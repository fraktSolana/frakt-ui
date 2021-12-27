import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { ChevronDownIcon } from '../../icons';
import { SelectTokenModal } from '../SelectTokenModal';
import { Token } from '../../utils';
import NumericInput from '../NumericInput';

export interface TokenFieldProps {
  tokensList?: Token[];
  onTokenChange?: (nextToken: Token) => void;
  currentToken?: Token;
  value: string;
  onValueChange: (nextValue: string) => void;
  modalTitle?: string;
  label?: string;
  balance?: string;
  balances?: {
    [key: string]: string;
  };
  style?: React.CSSProperties;
  className?: string;
  onUseMaxButtonClick?: () => void;
  error?: boolean;
  placeholder?: string;
  amountMaxLength?: number;
  disabled?: boolean;
}

const TokenField = ({
  tokensList,
  onTokenChange,
  currentToken,
  value,
  onValueChange,
  modalTitle,
  label,
  balance,
  balances = {},
  style,
  className,
  onUseMaxButtonClick,
  error,
  amountMaxLength,
  placeholder = '0.0',
  disabled = false,
}: TokenFieldProps): JSX.Element => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div
      style={style}
      className={classNames([
        { [styles.focused]: isFocused },
        { [styles.error]: error },
      ])}
    >
      {!!label && (
        <div className={styles.label}>
          {label}
          {!!balance && (
            <span>
              BALANCE: {balance} {currentToken?.symbol}
            </span>
          )}
        </div>
      )}
      <div
        className={classNames([styles.root, className])}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <NumericInput
          value={value}
          maxLength={amountMaxLength}
          onChange={onValueChange}
          placeholder={placeholder}
          positiveOnly
          className={classNames([
            styles.valueInput,
            { [styles.valueInput_disabled]: disabled },
          ])}
        />
        {!!onUseMaxButtonClick && (
          <div className={styles.useMaxBtnContainer}>
            <button
              type="button"
              className={styles.useMaxBtn}
              onClick={onUseMaxButtonClick}
            >
              Use max
            </button>
          </div>
        )}
        <div>
          <button
            type="button"
            className={classNames(styles.selectTokenBtn, {
              [styles.disabledTokens]: !tokensList || !onTokenChange,
            })}
            onClick={() => tokensList && setIsModalOpen(true)}
          >
            {currentToken ? (
              <img
                className={styles.tokenLogo}
                src={currentToken.img}
                alt={currentToken.symbol}
              />
            ) : (
              <div className={styles.noTokenImg} />
            )}
            <span
              className={classNames(styles.tokenName, {
                [styles.tokenName_empty]: !currentToken,
              })}
            >
              {currentToken?.symbol || '---'}
            </span>
            <ChevronDownIcon className={styles.arrowDownIcon} />
          </button>
        </div>
        {!!tokensList && !!onTokenChange && (
          <SelectTokenModal
            title={modalTitle}
            visible={isModalOpen}
            tokensList={tokensList}
            balances={balances}
            onChange={onTokenChange}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

interface TokenFieldFormProps
  extends Omit<Omit<TokenFieldProps, 'value'>, 'onValueChange'> {
  value?: {
    amount: string;
    token: Token | any;
  };
  onChange?: any;
  maxLength?: number;
}

export const TokenFieldForm: React.FC<TokenFieldFormProps> = ({
  onChange,
  value,
  ...props
}) => {
  const onAmountChange = (amount: string) => onChange?.({ ...value, amount });

  const onTokenChange = (token: Token) => onChange?.({ ...value, token });

  return (
    <TokenField
      {...props}
      value={value.amount}
      onValueChange={onAmountChange}
      onTokenChange={onTokenChange}
    />
  );
};

export default TokenField;
