import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { useConnection } from '@solana/wallet-adapter-react';

export const useSolanaTimestamp = () => {
  const { connection } = useConnection();

  const { data: solanaTimestamp, isLoading } = useQuery(
    ['solanaTimestamp'],
    async () => {
      const { absoluteSlot: lastSlot } = await connection.getEpochInfo();
      const solanaTimeUnix = await connection.getBlockTime(lastSlot);
      return solanaTimeUnix || moment().unix();
    },
    {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    solanaTimestamp,
    isLoading,
  };
};
