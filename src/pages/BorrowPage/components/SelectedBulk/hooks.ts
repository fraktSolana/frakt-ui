import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';

import { useLoadingModal } from '../../../../components/LoadingModal';
import { loansActions } from './../../../../state/loans/actions';
import { commonActions } from '../../../../state/common/actions';
import { proposeBulkLoan } from '../../../../utils/loans';
import { useConnection } from '../../../../hooks';
import { BulkValues } from '../../hooks';
import { getFeesOnDay } from './helpers';

type UseSeletedBulk = (props: { rawselectedBulk: BulkValues[] }) => {
  onSubmit: () => Promise<void>;
  closeLoadingModal: () => void;
  loadingModalVisible: boolean;
  selectedBulk: BulkValues[];
  feesOnDay: number;
};

export const useSeletedBulk: UseSeletedBulk = ({ rawselectedBulk }) => {
  const wallet = useWallet();
  const connection = useConnection();
  const dispatch = useDispatch();

  const [selectedBulk, setSelectedBulk] = useState(rawselectedBulk);

  const feesOnDay = getFeesOnDay(selectedBulk);

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  useEffect(() => {
    dispatch(loansActions.setBulkNfts(rawselectedBulk));
  }, [dispatch]);

  const showConfetti = (): void => {
    dispatch(commonActions.setConfetti({ isVisible: true }));
  };

  const onSubmit = async (): Promise<void> => {
    try {
      openLoadingModal();

      const result = await proposeBulkLoan({
        wallet,
        connection,
        selectedBulk,
      });

      if (!result) {
        throw new Error('Loan proposing failed');
      }

      showConfetti();
      setSelectedBulk([]);
    } catch (e) {
      console.error(e);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    selectedBulk,
    onSubmit,
    loadingModalVisible,
    closeLoadingModal,
    feesOnDay,
  };
};
