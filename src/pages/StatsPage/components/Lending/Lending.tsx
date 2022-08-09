import { FC } from 'react';
import classNames from 'classnames';

import { LastLoans, LedningPools } from '../../../../state/stats/types';
import { SOL_TOKEN } from '../../../../utils';
import styles from './Lending.module.scss';
import Block from '../Block';

interface LendingProps {
  lendingPools: LedningPools[];
  lastLoans: LastLoans[];
}

const Lending: FC<LendingProps> = ({ lendingPools, lastLoans }) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Lending</h2>
      <Block className={styles.block}>
        <div className={styles.lendingConainer}>
          <div className={styles.cardContainer}>
            <h3 className={styles.subtitle}>Last loans</h3>
            <div className={styles.cards}>
              {lastLoans.map(({ nftName, loanValue, image }, idx) => (
                <div key={idx} className={styles.card}>
                  <img src={image} className={styles.nftImage} />
                  <p className={styles.nftName}>{nftName}</p>
                  <p className={styles.cardTitle}>Loan Value</p>
                  <div className={styles.nftValue}>
                    <p>{loanValue}</p>
                    <img className={styles.icon} src={SOL_TOKEN.logoURI} />
                    SOL
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.line} />
          <div style={{ width: '100%' }}>
            <h3 className={styles.subtitle}>Lending pools</h3>
            <div className={styles.table}>
              <div className={styles.header}>
                <p className={styles.headerTitle}>Name</p>
                <div className={styles.headerValues}>
                  <p className={styles.headerTitle}>Apr</p>
                  <p className={styles.headerTitle}>TVL</p>
                </div>
              </div>
              {lendingPools.map(
                ({ nftName, apr, image, tvl, collectionsCount }, idx) => (
                  <div key={idx} className={styles.tableRow}>
                    <div className={styles.tableInfo}>
                      <p>{idx + 1}</p>
                      {image?.length > 1 ? (
                        <div
                          className={classNames(styles.poolImage, {
                            [styles.poolImageWithLabel]:
                              collectionsCount - 2 > 0,
                          })}
                          data-collections-amount={`+${collectionsCount - 2}`}
                        >
                          <img className={styles.rowImage} src={image[0]} />
                          <img className={styles.rowImage} src={image[1]} />
                        </div>
                      ) : (
                        <img className={styles.rowImage} src={image} />
                      )}
                      <p>{nftName}</p>
                    </div>
                    <div className={styles.tableStats}>
                      <p>{apr.toFixed(2)} %</p>
                      <p>{tvl.toFixed(2)} SOL</p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </Block>
    </div>
  );
};

export default Lending;
