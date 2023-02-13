import { FC } from 'react';

import { PATHS } from './paths';
import {
  Page404,
  HomePage,
  LendPage,
  StrategiesPage,
  LiquidationsPage,
  LoansPage,
  MarketsPage,
  MarketPage,
  OfferPage,
  BorrowRootPage,
  BorrowManualPage,
  BorrowBulkSuggestionPage,
  BorrowBulkOverviewPage,
  BorrowSuccessPage,
  MyStrategiesPage,
  StrategyCreationPage,
} from '@frakt/pages';

interface Route {
  path: string;
  exact: boolean;
  component: FC;
}

export const routes: Route[] = [
  {
    exact: true,
    path: PATHS.LEND,
    component: LendPage,
  },
  {
    exact: true,
    path: PATHS.STRATEGIES,
    component: StrategiesPage,
  },
  {
    exact: true,
    path: PATHS.MY_STRATEGIES,
    component: MyStrategiesPage,
  },
  {
    exact: true,
    path: PATHS.STRATEGY_CREATION,
    component: StrategyCreationPage,
  },
  {
    exact: true,
    path: PATHS.LIQUIDATIONS,
    component: LiquidationsPage,
  },
  {
    exact: true,
    path: PATHS.LOANS,
    component: LoansPage,
  },
  {
    exact: true,
    path: PATHS.BONDS,
    component: MarketsPage,
  },
  {
    exact: true,
    path: `${PATHS.BOND}/:marketPubkey`,
    component: MarketPage,
  },
  {
    exact: true,
    path: `${PATHS.OFFER}/:marketPubkey`,
    component: OfferPage,
  },
  {
    exact: true,
    path: `${PATHS.OFFER}/:marketPubkey/:pairPubkey`,
    component: OfferPage,
  },
  {
    exact: true,
    path: PATHS.BORROW_ROOT,
    component: BorrowRootPage,
  },
  {
    exact: true,
    path: PATHS.BORROW_MANUAL,
    component: BorrowManualPage,
  },
  {
    exact: true,
    path: PATHS.BORROW_BULK_SUGGESTION,
    component: BorrowBulkSuggestionPage,
  },
  {
    exact: true,
    path: PATHS.BORROW_BULK_OVERVIEW,
    component: BorrowBulkOverviewPage,
  },
  {
    exact: true,
    path: PATHS.BORROW_SUCCESS,
    component: BorrowSuccessPage,
  },
  {
    exact: true,
    path: PATHS.ROOT,
    component: HomePage,
  },
  {
    exact: true,
    path: PATHS.PAGE_404,
    component: Page404,
  },
  {
    exact: true,
    path: '*',
    component: Page404,
  },
];
