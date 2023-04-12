import { FC, useRef } from 'react';

import { useOnClickOutside } from '@frakt/hooks';
import Button from '@frakt/components/Button';
import { Loan } from '@frakt/api/loans';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/components/FiltersDropdown';

import { useLoanCard } from '../../LoanCard/hooks';
import styles from '../LoansTable.module.scss';

export const StakingLoanCell: FC<{ loan: Loan }> = ({ loan }) => {
  const { onCardinalUnstake } = useLoanCard(loan);

  const {
    visible: modalVisible,
    close: closeModal,
    toggle: toggleModal,
  } = useFiltersModal();

  const ref = useRef();
  useOnClickOutside(ref, closeModal);

  const isStakingSupport = !!loan?.classicParams?.rewards?.stakeState;

  return (
    <div className={styles.filters} ref={ref}>
      {isStakingSupport && (
        <>
          <Button
            onClick={(event) => {
              toggleModal();
              event.stopPropagation();
            }}
            className={styles.moreActionsButton}
            type="tertiary"
          >
            Staking
          </Button>
          {modalVisible && (
            <FiltersDropdown className={styles.filtersDropdown}>
              <div className={styles.stakingContent}>
                <h4 className={styles.stakingTitle}>Staking</h4>
                <div className={styles.stakingButtonWrapper}>
                  <Button onClick={onCardinalUnstake}>Unstake</Button>
                </div>
              </div>
            </FiltersDropdown>
          )}
        </>
      )}
    </div>
  );
};
