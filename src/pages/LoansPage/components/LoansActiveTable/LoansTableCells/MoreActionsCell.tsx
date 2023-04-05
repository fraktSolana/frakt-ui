import { FC, useRef } from 'react';

import { useOnClickOutside } from '@frakt/hooks';
import { Loan } from '@frakt/api/loans/types';
import { HorizontalDots } from '@frakt/icons';
import Button from '@frakt/components/Button';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/components/FiltersDropdown';

import { useLoanCard } from '../../LoanCard/hooks';

import styles from '../LoansTable.module.scss';

export const MoreActionsCell: FC<{ loan: Loan }> = ({ loan }) => {
  const { onCardinalUnstake } = useLoanCard(loan);

  const {
    visible: modalVisible,
    close: closeModal,
    toggle: toggleModal,
  } = useFiltersModal();

  const ref = useRef();
  useOnClickOutside(ref, () => closeModal);

  const isStakingSupport = !!loan?.classicParams?.rewards?.stakeState;

  return (
    <div className={styles.filters} ref={ref}>
      <Button
        onClick={(event) => {
          toggleModal();
          event.stopPropagation();
        }}
        className={styles.moreActionsButton}
        type="tertiary"
      >
        <HorizontalDots className={styles.horizontalDots} />
      </Button>
      {modalVisible && (
        <FiltersDropdown className={styles.filtersDropdown}>
          <div className={styles.liquidateButtonWrapper}>
            <Button className={styles.liquidateButton} type="secondary">
              Liquidate for +10.32 SOL
            </Button>
            <Button className={styles.liquidateButton} type="secondary">
              Refinance for -10.32 SOL
            </Button>
          </div>
          {isStakingSupport && (
            <div className={styles.stakingContent}>
              <h4 className={styles.stakingTitle}>Staking</h4>
              <div className={styles.stakingButtonWrapper}>
                <Button type="secondary" disabled>
                  Claim
                </Button>
                <Button onClick={onCardinalUnstake}>Unstake</Button>
              </div>
            </div>
          )}
        </FiltersDropdown>
      )}
    </div>
  );
};
