import ReactDOM from 'react-dom';

import { CloseModal } from '@frakt/icons';
import styles from './ModalPortal.module.scss';

const ModalPortal = ({ visible, children, onCancel }) => {
  const modalRoot = document.getElementById('modal');
  return ReactDOM.createPortal(
    visible && (
      <>
        <div className={styles.backdrop}></div>
        <div className={styles.body}>
          <div className={styles.closeModalIcon} onClick={onCancel}>
            <CloseModal className={styles.closeIcon} />
          </div>
          {children}
        </div>
      </>
    ),
    modalRoot,
  );
};

export default ModalPortal;
