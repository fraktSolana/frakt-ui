import { useDispatch, useSelector } from 'react-redux';

import styles from './styles.module.scss';
import { WalletItem } from './WalletItem';
import { useWallet } from '@solana/wallet-adapter-react';
import CurrentUserTable from '../CurrentUserTable';
import { commonActions } from '../../state/common/actions';
import { selectUser } from '../../state/common/selectors';
import { sendAmplitudeData } from '../../utils/amplitude';
import { useRef } from 'react';
import { useOnClickOutside } from '../../utils';

interface WalletContentProps {
  className?: string;
}

const WalletContent = ({ className = '' }: WalletContentProps): JSX.Element => {
  const dispatch = useDispatch();
  const { wallets, select, connected } = useWallet();
  const user = useSelector(selectUser);

  const ref = useRef();
  useOnClickOutside(ref, () =>
    dispatch(commonActions.setWalletModal({ isVisible: false })),
  );

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div
        className={styles.overlay}
        onClick={() => {
          dispatch(commonActions.setWalletModal({ isVisible: false }));
          sendAmplitudeData('navigation-connect');
        }}
      />
      <div ref={ref} className={`${styles.container} container`}>
        {connected ? (
          <CurrentUserTable className={styles.itemsContainer} user={user} />
        ) : (
          <div className={styles.itemsContainer}>
            {wallets.map(({ adapter }, idx) => (
              <WalletItem
                key={idx}
                onClick={(): void => {
                  select(adapter.name);
                  dispatch(commonActions.setWalletModal({ isVisible: false }));
                }}
                imageSrc={adapter.icon}
                imageAlt={adapter.name}
                name={adapter.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletContent;
