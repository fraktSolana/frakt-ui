import { FC } from 'react';

import img from './mockPreview.jpg';
import Button from '@frakt/components/Button';
import Tooltip from '@frakt/components/Tooltip';
import CollectionsPreviews from '../CollectionsPreviews';

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Solana } from '@frakt/icons';
import styles from './Strategy.module.scss';

const Strategy: FC<any> = ({ onClick }) => {
  return (
    <>
      <div className={styles.strategy}>
        <div className={styles.header}>
          <img src={img} className={styles.image} />
          <div className={styles.title}>
            Timur’s awesome strategy. Don’t deposit. It’s risky
          </div>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.info}>
            <div className={styles.infoTitle}>collections</div>
            <div className={styles.infoValue}>
              <CollectionsPreviews />
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoTitle}>
              <span>deposit yield</span>
              <Tooltip
                placement="bottom"
                overlay="Yearly rewards based on the current utilization rate and borrow interest"
              >
                <QuestionCircleOutlined className={styles.questionIcon} />
              </Tooltip>
            </div>
            <div className={styles.infoValue}>180 %</div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoTitle}>total liquidity</div>
            <div className={styles.infoValue}>
              <span>3820.78</span>
              <Solana className={styles.solana} />
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoTitle}>your liquidity</div>
            <div className={styles.infoValue}>
              <span>8</span>
              <Solana className={styles.solana} />
            </div>
          </div>
        </div>
        <div className={styles.btnWrapper}>
          <Button className={styles.btn} type="secondary" onClick={onClick}>
            Deposit
          </Button>
          {/* <Button
          className={styles.btn}
          type="secondary"
          // onClick={() => {
          //   openPoolModal(TabsNames.DEPOSIT);
          //   sendAmplitudeData('loans-deposit');
          // }}
        >
          Manage
        </Button>
        <Button
          className={styles.btn}
          type="primary"
          // onClick={() => {
          //   openPoolModal(TabsNames.DEPOSIT);
          //   sendAmplitudeData('loans-deposit');
          // }}
        >
          Withdraw all
        </Button> */}
        </div>
      </div>
    </>
  );
};

export default Strategy;
