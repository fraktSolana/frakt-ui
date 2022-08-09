import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { BlockContent } from '../BlockContent';
import imageOne from '../../../images/landing1.png';
import imageTwo from '../../../images/landing2.png';
import { SolanaIcon } from '../../../../../icons';
import { LandingInfoIcon } from '../../../svg';
import { PATHS } from '../../../../../constants';

interface LendingBlockProps {
  className?: string;
}

export const LendingBlock: FC<LendingBlockProps> = ({ className }) => {
  return (
    <div className={classNames(className)}>
      <div className={styles.imagesWrapper}>
        <div className={classNames(styles.image)}>
          <img src={imageOne} alt="" />
        </div>
        <div className={classNames(styles.image, styles.imageTwo)}>
          <img src={imageTwo} alt="" />
          <div className={styles.infoWrapper}>
            <div>
              <p>TYR-1281</p>
              <p>
                100
                <SolanaIcon />
                SOL
              </p>
            </div>
          </div>
        </div>
      </div>
      <BlockContent
        title={'Loans'}
        icon={<LandingInfoIcon />}
        text={
          'Get instant loans against your NFTs, use that liquidity and then repay with a little interest'
        }
        to={PATHS.LOANS}
      />
    </div>
  );
};
