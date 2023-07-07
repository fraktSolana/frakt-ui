import { FC } from 'react';

import { SolanaFM } from '@frakt/icons';

import styles from './SolanaNFTLink.module.scss';

export const SolanaNFTLink: FC<{ nftMint: string }> = ({ nftMint }) => {
  return (
    <a
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
      href={`https://solana.fm/address/${nftMint}`}
    >
      <img src={SolanaFM} />
    </a>
  );
};
