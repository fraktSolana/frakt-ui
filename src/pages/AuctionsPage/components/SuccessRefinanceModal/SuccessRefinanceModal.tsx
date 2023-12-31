import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import { Button } from '@frakt/components/Button';
import { StatInfo } from '@frakt/components/StatInfo';
import { Modal } from '@frakt/components/Modal';
import { PATHS } from '@frakt/constants';
import {
  useSearchSelectedMarketsURLControl,
  useVisibleMarketURLControl,
} from '@frakt/hooks';

import styles from './SuccessRefinanceModal.module.scss';

interface SuccessRefinanceModalProps {
  open: boolean;
  onCancel: () => void;
  nftImage: string;
  floorPrice: string;
  lendPrice: string;
  interest: number;
  collectionName: string;
}

const SuccessRefinanceModal: FC<SuccessRefinanceModalProps> = ({
  open,
  onCancel,
  nftImage,
  floorPrice,
  lendPrice,
  interest,
  collectionName,
}) => {
  const history = useHistory();

  const { setSelectedOptions } = useSearchSelectedMarketsURLControl();
  const { toggleVisibleCard } = useVisibleMarketURLControl();

  const goToLiteLending = () => {
    setSelectedOptions([collectionName]);
    toggleVisibleCard(collectionName);

    history.push({
      pathname: PATHS.BONDS_LITE,
      search: `?opened=${collectionName}&collections=${collectionName}`,
    });
  };

  const statInfoClasses = {
    container: styles.statInfo,
    value: styles.statInfoValue,
  };

  const titleText = 'You have successfully refinanced the loan';

  return (
    <Modal
      open={open}
      centered
      onCancel={onCancel}
      width={684}
      footer={false}
      closable={false}
      className={styles.modal}
      closeIcon
    >
      <div className={styles.container}>
        <div className={styles.innerContentainer}>
          <h3 className={classNames(styles.title, styles.mobileTitle)}>
            {titleText}
          </h3>
          <img className={styles.image} src={nftImage} />
          <div className={styles.content}>
            <h3 className={styles.title}>{titleText}</h3>
            <div className={styles.stats}>
              <StatInfo
                classNamesProps={statInfoClasses}
                decimalPlaces={2}
                label="Floor"
                value={floorPrice}
              />
              <StatInfo
                classNamesProps={statInfoClasses}
                decimalPlaces={2}
                label="Lend price"
                value={lendPrice}
              />
              <StatInfo
                classNamesProps={statInfoClasses}
                decimalPlaces={2}
                label="Interest"
                value={interest}
              />
            </div>
          </div>
        </div>
        <p className={styles.subtitle}>
          It will show up in{' '}
          <a onClick={goToLiteLending} className={styles.link}>
            my loans
          </a>{' '}
          in no time
        </p>
        <Button
          onClick={goToLiteLending}
          type="secondary"
          className={styles.button}
        >
          Check it out
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessRefinanceModal;
