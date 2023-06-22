import { useEffect, useState } from 'react';
import { web3 } from '@frakt-protocol/frakt-sdk';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

export const useNativeAccount = (): {
  account: web3.AccountInfo<Buffer>;
} => {
  const { connection } = useConnection();
  const { wallet, publicKey } = useWallet();

  const [nativeAccount, setNativeAccount] =
    useState<web3.AccountInfo<Buffer>>();

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.getAccountInfo(publicKey).then((acc) => {
      if (acc) {
        setNativeAccount(acc);
      }
    });
    connection.onAccountChange(publicKey, (acc) => {
      if (acc) {
        setNativeAccount(acc);
      }
    });
  }, [wallet, publicKey, connection]);

  return { account: nativeAccount };
};
