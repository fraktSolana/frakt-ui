import { FC } from 'react';
import BN from 'bn.js';
import { Controller } from 'react-hook-form';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';

import { InputControlsNames, useDeposit } from './hooks';
import RefreshIcon from '../../icons/refreshIcon';
import Checkbox from '../CustomCheckbox';
import NumericInput from '../NumericInput';
import styles from './styles.module.scss';
import { SOL_TOKEN } from '../../utils';
import { Modal } from '../Modal';
import Button from '../Button';
import { useLiquidityPools } from '../../contexts/liquidityPools';

interface DepositModalProps {
  visible: boolean;
  onCancel: () => void;
  tokenInfo: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
}

const DepositModal: FC<DepositModalProps> = ({
  visible,
  onCancel,
  tokenInfo,
  poolConfig,
}) => {
  const {
    formControl,
    isDepositBtnEnabled,
    totalValue,
    handleChange,
    baseValue, //TODO: rename
    quoteValue, //TODO: rename
  } = useDeposit(tokenInfo);

  const { provideRaydiumLiquidity } = useLiquidityPools();

  const onSubmitHandler = () => {
    const baseTokenMint = tokenInfo.address;
    const baseAmount = new BN(Number(quoteValue) * 10 ** tokenInfo.decimals);

    const tokenInfoMint = SOL_TOKEN.address;
    const quoteAmount = new BN(Number(baseValue) * 1e9);

    const marketId = poolConfig.marketId;

    provideRaydiumLiquidity(
      baseAmount,
      quoteAmount,
      baseTokenMint,
      tokenInfoMint,
      marketId,
    );
  };

  return (
    <Modal
      visible={visible}
      centered
      onCancel={onCancel}
      title="Deposit Liquidity"
      width={500}
      className={styles.modal}
    >
      <div className={styles.container}>
        <div className={styles.inputWrapper}>
          <div className={styles.token}>
            <img src={SOL_TOKEN.logoURI} className={styles.tokenIcon} />
            <p className={styles.tokenName}>{SOL_TOKEN.symbol}</p>
          </div>
          <NumericInput
            className={styles.input}
            value={baseValue}
            onChange={(value) =>
              handleChange(value, InputControlsNames.BASE_VALUE)
            }
          />
        </div>
        <div className={styles.inputWrapper}>
          <div className={styles.token}>
            <img src={tokenInfo.logoURI} className={styles.tokenIcon} />
            <p className={styles.tokenName}>{tokenInfo.symbol}</p>
          </div>
          <NumericInput
            className={styles.input}
            value={quoteValue}
            onChange={(value) =>
              handleChange(value, InputControlsNames.QUOTE_VALUE)
            }
          />
        </div>
        <div className={styles.totalLine}>
          <p className={styles.title}>Total</p>
          <div className={styles.line} />
        </div>
        <div className={styles.totalInputWrapper}>
          <NumericInput className={styles.input} value={totalValue} readOnly />
        </div>
        <div className={styles.refresh}>
          <RefreshIcon className={styles.refreshIcon} />
          <p className={styles.subtitle}>Refreshing pool data every 10s...</p>
        </div>
        <p className={styles.subtitle}>Estimated earnings from fees (7d)</p>
        <div className={styles.depositContent}>
          <div className={styles.depositInfo}>
            <p className={styles.value}>
              $ 0.00 <span>/ month</span>
            </p>
            <p className={styles.value}>
              8.38 % <span>/ apr</span>
            </p>
          </div>
          <p className={styles.link}>After staking</p>
        </div>
        <div className={styles.verify}>
          <Controller
            control={formControl}
            name={InputControlsNames.IS_VERIFIED}
            render={({ field }) => <Checkbox {...field} />}
          />
          <p className={styles.text}>
            I verify that I have read the{' '}
            <a href="#" target="_blank" rel="noopener noreferrer">
              Fraktion Pools Guide
            </a>{' '}
            and understand the risks of providing liquidity, including
            impermanent loss.
          </p>
        </div>
        <Button
          className={styles.depositBtn}
          type="alternative"
          disabled={!isDepositBtnEnabled}
          onClick={onSubmitHandler}
        >
          Deposit
        </Button>
      </div>
    </Modal>
  );
};

export default DepositModal;
