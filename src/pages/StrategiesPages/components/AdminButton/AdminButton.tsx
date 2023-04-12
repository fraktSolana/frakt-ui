import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@frakt/components/Button';

import { PATHS } from '@frakt/constants';
import styles from './AdminButton.module.scss';

const AdminButton: FC = () => {
  const history = useHistory();

  const goToStrategyCreation = () => history.push(PATHS.STRATEGY_CREATION);

  return (
    <div className={styles.adminButton}>
      <Button
        className={styles.btn}
        type="secondary"
        onClick={goToStrategyCreation}
      >
        Create strategy
      </Button>
    </div>
  );
};

export default AdminButton;
