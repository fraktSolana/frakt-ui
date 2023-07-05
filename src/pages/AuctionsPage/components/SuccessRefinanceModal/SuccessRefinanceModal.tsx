import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { NavigationButton } from '@frakt/components/Button';
import { StatInfo } from '@frakt/components/StatInfo';
import { Modal } from '@frakt/components/Modal';
import { PATHS } from '@frakt/constants';

import styles from './SuccessRefinanceModal.module.scss';
import classNames from 'classnames';

interface SuccessRefinanceModalProps {
  open: boolean;
  onCancel: () => void;
  nftImage: string;
  floorPrice: string;
  lendPrice: string;
}

const SuccessRefinanceModal: FC<SuccessRefinanceModalProps> = ({
  open,
  onCancel,
  nftImage,
  floorPrice,
  lendPrice,
}) => {
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
                decimalPlaces={0}
                label="Floor"
                value={floorPrice}
              />
              <StatInfo
                classNamesProps={statInfoClasses}
                decimalPlaces={0}
                label="Lend price"
                value={lendPrice}
              />
              <StatInfo
                classNamesProps={statInfoClasses}
                decimalPlaces={0}
                label="Interest"
                value="2"
              />
            </div>
          </div>
        </div>
        <p className={styles.subtitle}>
          Now you can check it on{' '}
          <NavLink to={PATHS.LOANS} className={styles.link}>
            your loans
          </NavLink>{' '}
          that you fund
        </p>
        <NavigationButton
          path={PATHS.LOANS}
          type="secondary"
          className={styles.button}
        >
          Check it out
        </NavigationButton>
      </div>
    </Modal>
  );
};

export default SuccessRefinanceModal;
