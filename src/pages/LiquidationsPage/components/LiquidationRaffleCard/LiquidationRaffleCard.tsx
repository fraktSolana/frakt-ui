import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import Button from '../../../../components/Button';
import { SolanaIcon } from '../../../../icons';
import { liquidationsActions } from '../../../../state/liquidations/actions';
import { selectTxRaffleTryStatus } from '../../../../state/liquidations/selectors';
import { useOnFulfilled } from '../../../../hooks';
import styles from './LiquidationRaffleCard.module.scss';

const LiquidationRaffleCard: FC<{ data; disabled: boolean }> = ({
  data,
  disabled,
}) => {
  const [tryId, setTryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const txRequestStatus = useSelector(selectTxRaffleTryStatus);
  useOnFulfilled(txRequestStatus, () => {
    setIsLoading(false);
  });

  const handleClick = () => {
    setTryId(data.nftMint);
  };

  const handleSumit = () => {
    setTryId(null);
    setIsLoading(true);
    dispatch(liquidationsActions.txRaffleTry(data));
  };

  return (
    <div className={styles.card}>
      <div className={styles.nftInfo}>
        <img className={styles.nftImage} src={data.nftImageUrl} />
        <div>
          <p className={styles.nftName}>{data.nftName}</p>
        </div>
      </div>
      <div className={styles.statsValue}>
        <div className={classNames(styles.totalValue, styles.opacity)}>
          <p className={styles.subtitle}>Floor price</p>
          <p className={styles.value}>
            {`${data.nftFloorPrice}`} <SolanaIcon />
          </p>
        </div>
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>liquidation price</p>
          <p className={styles.value}>
            {`${data.liquidationPrice}`}
            <SolanaIcon />
          </p>
        </div>
        <Button
          type="secondary"
          className={styles.btn}
          onClick={handleClick}
          disabled={disabled}
        >
          Try by 0 ticket
        </Button>
      </div>
      <ConfirmModal
        visible={tryId}
        onCancel={() => setTryId(null)}
        onSubmit={handleSumit}
        title="Ready?"
        subtitle={`You are about to confirm the transaction to try your chance in raffle for ${data.nftName}`}
        btnAgree="Let's go"
      />
      <LoadingModal
        title="Please approve transaction"
        visible={isLoading}
        onCancel={() => setIsLoading(false)}
      />
    </div>
  );
};

export default LiquidationRaffleCard;
