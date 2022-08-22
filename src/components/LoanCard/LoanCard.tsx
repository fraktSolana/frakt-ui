import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import Tooltip from '../Tooltip';
import { BN } from '@frakt-protocol/frakt-sdk';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { LoadingModal, useLoadingModal } from '../LoadingModal';
import {
  paybackLoan as paybackLoanTx,
  caclTimeToRepay,
} from '../../utils/loans';
import styles from './LoanCard.module.scss';
import { useConnection, useCountdown } from '../../hooks';
import { SOL_TOKEN } from '../../utils';
import Button from '../Button';
import { Loan } from '../../state/loans/types';

import { HEALTH_TOOLTIP_TEXT } from './constants';
import {
  PartialRepayModal,
  usePartialRepayModal,
} from '../../pages/LiquidationsPage/components/PartialRepayModal';
import { loansActions } from '../../state/loans/actions';
import { commonActions } from '../../state/common/actions';
import { SolanaIcon, Timer } from '../../icons';

interface LoanCardProps {
  loan: Loan;
}

const usePaybackLoan = (loan: Loan) => {
  const wallet = useWallet();
  const connection = useConnection();
  const dispatch = useDispatch();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const {
    visible: partialRepayModalVisible,
    open: openPartialRepayModal,
    close: closePartialRepayModal,
  } = usePartialRepayModal();

  const removeTokenOptimistic = (mint: string) => {
    dispatch(loansActions.addHiddenLoanNftMint(mint));
  };

  const showConfetti = (): void => {
    dispatch(commonActions.setConfetti({ isVisible: true }));
  };

  const onPartialPayback = async (paybackAmount: BN) => {
    try {
      openLoadingModal();
      closePartialRepayModal();

      const result = await paybackLoanTx({
        connection,
        wallet,
        loan,
        paybackAmount,
      });

      if (!result) {
        throw new Error('Payback failed');
      }

      showConfetti();
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  const onPayback = async () => {
    try {
      const { isPriceBased, isGracePeriod } = loan;

      if (isPriceBased && !isGracePeriod) {
        openPartialRepayModal();
        return;
      }

      openLoadingModal();

      const result = await paybackLoanTx({
        connection,
        wallet,
        loan,
      });

      if (!result) {
        throw new Error('Payback failed');
      }

      showConfetti();
      removeTokenOptimistic(loan.mint);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    onPartialPayback,
    closePartialRepayModal,
    partialRepayModalVisible,
    onPayback,
    closeLoadingModal,
    loadingModalVisible,
  };
};

const LoanCard: FC<LoanCardProps> = ({ loan }) => {
  const {
    closeLoadingModal,
    loadingModalVisible,
    partialRepayModalVisible,
    closePartialRepayModal,
    onPartialPayback,
    onPayback,
  } = usePaybackLoan(loan);

  const { imageUrl, name, isGracePeriod } = loan;

  return (
    <>
      <div className={styles.cardWrapper}>
        <div
          className={classNames(styles.card, {
            [styles.isGracePeriodCard]: isGracePeriod,
          })}
        >
          <div
            className={styles.image}
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className={styles.content}>
            <p className={styles.title}>{name}</p>
            <LoanCardValues loan={loan} />
            <Button type="secondary" className={styles.btn} onClick={onPayback}>
              Repay
            </Button>
          </div>
        </div>
      </div>
      <PartialRepayModal
        visible={partialRepayModalVisible}
        onCancel={closePartialRepayModal}
        onPartialPayback={onPartialPayback}
        loan={loan}
      />
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};

export default LoanCard;

const LoanCardValues: FC<{
  loan: Loan;
}> = ({ loan }) => {
  const {
    loanValue,
    repayValue,
    isPriceBased,
    borrowAPRPercents,
    liquidationPrice,
    realLiquidationPrice,
  } = loan;

  return (
    <div className={styles.valuesWrapper}>
      <div
        className={classNames(styles.valuesWrapperColumn, {
          [styles.valuesWrapperRow]: isPriceBased,
        })}
      >
        <div className={styles.valueWrapper}>
          <p className={styles.valueTitle}>Borrowed</p>
          <div className={styles.valueInfo}>
            <p>{loanValue && loanValue.toFixed(2)}</p>
            <SolanaIcon />
          </div>
        </div>

        <div className={styles.valueWrapper}>
          <p className={styles.valueTitle}>Debt</p>
          <div className={styles.valueInfo}>
            <p>
              {isPriceBased
                ? liquidationPrice && liquidationPrice.toFixed(2)
                : liquidationPrice
                ? liquidationPrice.toFixed(2)
                : repayValue && repayValue.toFixed(2)}
            </p>
            <SolanaIcon />
          </div>
        </div>
      </div>

      {isPriceBased && (
        <div className={styles.valuesWrapperRow}>
          <div className={styles.valueWrapper}>
            <div className={styles.valueWithTooltip}>
              <p className={styles.valueTitle}>Borrow interest</p>
              <Tooltip
                placement="bottom"
                overlay="The current yearly interest rate paid by borrowers"
              >
                <QuestionCircleOutlined className={styles.questionIcon} />
              </Tooltip>
            </div>
            <div className={styles.valueInfo}>
              <p>{borrowAPRPercents} %</p>
            </div>
          </div>
          <div className={styles.valueWrapper}>
            <p className={styles.valueTitle}>Liquidation price</p>
            <div className={styles.valueInfo}>
              <p>{realLiquidationPrice && realLiquidationPrice.toFixed(2)}</p>
              <img
                className={styles.valueInfoSolImage}
                src={SOL_TOKEN.logoURI}
              />
              <p>{SOL_TOKEN.symbol}</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.valueWrapper}>
        {isPriceBased ? (
          <div className={styles.valueWithTooltip}>
            <p className={styles.valueTitle}>Health</p>
            <Tooltip placement="bottom" overlay={HEALTH_TOOLTIP_TEXT}>
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div>
        ) : (
          <p className={styles.valueTitle}>Time to return</p>
        )}
        {isPriceBased ? <Health loan={loan} /> : <TimeToReturn loan={loan} />}
      </div>
    </div>
  );
};

const TimeToReturn: FC<{
  loan: Loan;
}> = ({ loan }) => {
  const { expiredAtUnix, loanDurationInSeconds } = caclTimeToRepay(loan);

  const { timeLeft, leftTimeInSeconds } = useCountdown(expiredAtUnix);

  const progress =
    ((loanDurationInSeconds - leftTimeInSeconds) / loanDurationInSeconds) * 100;

  return (
    <div className={classNames(styles.valueInfo, styles.valueInfoHealth)}>
      <div className={styles.timerWrapper}>
        <Timer className={styles.icon} />
        <div className={styles.countdown}>
          <p>{timeLeft.days}d</p>
          <span className={styles.timeDelim}>:</span>
          <p>{timeLeft.hours}h</p>
          <span className={styles.timeDelim}>:</span>
          <p>{timeLeft.minutes}m</p>
          <span className={styles.timeDelim}>:</span>
          <p>{timeLeft.seconds}s</p>
        </div>
      </div>

      <LoanHealthProgress healthPercent={progress} />
    </div>
  );
};

const Health: FC<{
  loan: Loan;
}> = ({ loan }) => {
  const { health: rawHealth = 0 } = loan;

  const health = rawHealth > 100 ? 100 : rawHealth;

  return (
    <div className={classNames(styles.valueInfo, styles.valueInfoHealth)}>
      <p>{health}%</p>
      <LoanHealthProgress healthPercent={100 - health} />
    </div>
  );
};

const LoanHealthProgress: FC<{
  healthPercent: number;
}> = ({ healthPercent }) => {
  return (
    <div className={styles.progressWrapper}>
      <div
        className={styles.progress}
        style={{ width: `${100 - healthPercent}%` }}
      />
    </div>
  );
};
