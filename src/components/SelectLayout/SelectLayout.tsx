import { FC } from 'react';

import Sidebar from './components/Sidebar';
import { BorrowNFT } from '../../state/userTokens/types';
import { AppLayout } from '../Layout/AppLayout';
import styles from './SelectLayout.module.scss';
import { Container } from '../Layout';

interface SelectLayoutProps {
  selectedNfts: BorrowNFT[];
  onDeselect?: (nft: BorrowNFT) => void;
  sidebarForm: JSX.Element;
  isCloseSidebar?: boolean;
}

export const SelectLayout: FC<SelectLayoutProps> = ({
  children,
  selectedNfts,
  onDeselect,
  sidebarForm,
  isCloseSidebar,
}) => {
  return (
    <AppLayout className={styles.positionRelative}>
      <Sidebar
        nfts={selectedNfts}
        onDeselect={onDeselect}
        sidebarForm={sidebarForm}
        isCloseSidebar={isCloseSidebar}
      />
      <Container component="main" className={styles.contentWrapper}>
        <div id="content-reducer" className={styles.contentReducer}>
          {children}
        </div>
      </Container>
    </AppLayout>
  );
};
