import { web3 } from '@frakt-protocol/frakt-sdk';
import { useQuery } from '@tanstack/react-query';

import {
  AvailableToBorrowUser,
  CollectionsStats,
  fetchAllUserStats,
  fetchAvailableToBorrowUser,
  fetchCollectionsStats,
  UserStats,
} from '@frakt/api/user';

export const useFetchAvailableToBorrowUser = ({ walletPublicKey }) => {
  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: AvailableToBorrowUser;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchAvailableToBorrowUser', walletPublicKey],
    () => fetchAvailableToBorrowUser({ publicKey: walletPublicKey }),
    {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      enabled: !!walletPublicKey,
    },
  );

  return {
    data: data,
    isLoading: isLoading || isFetching,
  };
};

export const useFetchCollectionsStats = () => {
  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: CollectionsStats;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(['fetchCollectionsStats'], () => fetchCollectionsStats(), {
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  return {
    data: data,
    loading: isLoading || isFetching,
  };
};

export const useFetchAllStats = ({
  walletPublicKey,
  enabled,
}: {
  walletPublicKey: web3.PublicKey;
  enabled?: boolean;
}) => {
  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: UserStats;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchAllStats', walletPublicKey],
    () => fetchAllUserStats({ publicKey: walletPublicKey }),
    {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      enabled: enabled || !walletPublicKey,
    },
  );

  return {
    data: data,
    loading: isLoading || isFetching,
  };
};
