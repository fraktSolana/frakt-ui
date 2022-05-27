import React, { FC, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import classNames from 'classnames';

import { SelectTokenModal } from '../SelectTokenModal';
import { ChevronDownIcon } from '../../icons';
import NumericInput from '../NumericInput';
import styles from './styles.module.scss';
import { SOL_TOKEN } from '../../utils';
import { useHeaderState } from '../Layout/headerState';

export interface TokenFieldProps {
  tokensList?: TokenInfo[];
  onTokenChange?: (nextToken: TokenInfo) => void;
  currentToken?: TokenInfo;
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
  lpTokenSymbol?: string;
  placeholder?: string;
  amountMaxLength?: number;
  disabled?: boolean;
}

const TokenField: FC<TokenFieldProps> = ({
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
  lpTokenSymbol,
  placeholder = '0.0',
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { onContentScroll } = useHeaderState();

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
            {lpTokenSymbol && (
              <span className={classNames(styles.tokenName)}>
                {lpTokenSymbol} / {SOL_TOKEN.symbol}
              </span>
            )}
            {currentToken ? (
              <img
                className={styles.tokenLogo}
                src={currentToken.logoURI}
                alt={currentToken.symbol}
              />
            ) : (
              !lpTokenSymbol && <div className={styles.noTokenImg} />
            )}
            {!lpTokenSymbol && (
              <span
                className={classNames(styles.tokenName, {
                  [styles.tokenName_empty]: !currentToken,
                })}
              >
                {currentToken?.symbol || '---'}
              </span>
            )}
            <ChevronDownIcon className={styles.arrowDownIcon} />
          </button>
        </div>

        {!!tokensList && !!onTokenChange && (
          <div
            className={styles.content}
            onScroll={onContentScroll}
            id="app-content"
          >
            <SelectTokenModal
              title={modalTitle}
              visible={isModalOpen}
              balances={balances}
              onChange={onTokenChange}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface TokenFieldFormProps
  extends Omit<TokenFieldProps, 'value' | 'onValueChange'> {
  value?: {
    amount: string;
    token: TokenInfo | any;
  };
  onChange?: any;
  maxLength?: number;
}

export const TokenFieldForm: FC<TokenFieldFormProps> = ({
  onChange,
  value,
  ...props
}) => {
  const onAmountChange = (amount: string) => onChange?.({ ...value, amount });

  const onTokenChange = (token: TokenInfo) => onChange?.({ ...value, token });

  return (
    <TokenField
      {...props}
      value={value?.amount}
      onValueChange={onAmountChange}
      onTokenChange={onTokenChange}
    />
  );
};

export default TokenField;
