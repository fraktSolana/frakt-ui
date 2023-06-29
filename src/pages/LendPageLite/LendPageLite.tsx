import { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { PATHS } from '@frakt/constants';

import LendLitePageContent from './components/LendLitePageContent';
import { RootHeader, LendMode } from './components/RootHeader';

const LendPageLite: FC = () => {
  const history = useHistory();

  const goToProLending = () => history.push(PATHS.BONDS);

  return (
    <AppLayout>
      <RootHeader mode={LendMode.LITE} onModeSwitch={goToProLending} />
      <LendLitePageContent />
    </AppLayout>
  );
};

export default LendPageLite;
