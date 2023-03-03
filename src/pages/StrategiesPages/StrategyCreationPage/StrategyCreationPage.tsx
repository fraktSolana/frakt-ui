import { FC } from 'react';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import Titles from '@frakt/components/Titles';
import Steps from './components/Steps';

const StrategyCreationPage: FC = () => {
  return (
    <AppLayout>
      <Titles title="Strategy creation" />
      <Steps />
    </AppLayout>
  );
};

export default StrategyCreationPage;
