import { FC } from 'react';

import { AppLayout } from '@frakt/components/Layout/AppLayout';

import LendLitePageContent from './components/LendLitePageContent';
import GeneralLendInfo from './components/GeneralLendInfo';

const LendPageLite: FC = () => {
  return (
    <AppLayout>
      <GeneralLendInfo />
      <LendLitePageContent />
    </AppLayout>
  );
};

export default LendPageLite;
