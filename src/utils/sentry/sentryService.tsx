import * as Sentry from '@sentry/browser';
import { Dictionary } from 'lodash';

import { SENTRY_APP_DSN } from './constants';

export const initSentry = () => {
  Sentry.init({
    dsn: SENTRY_APP_DSN,
    ignoreErrors: [
      'Registration failed - push service error',
      'We are unable to register the default service worker',
      'The notification permission was not granted and blocked instead',
      'The string did not match the expected pattern',
      'User rejected the request',
    ],
    defaultIntegrations: false,

    // integrations: [
    //   new Integrations.BrowserTracing({
    //     traceXHR: false,
    //     routingInstrumentation:
    //       ReactSentry.reactRouterV5Instrumentation(history),
    //   }),
    // ],

    tracesSampleRate: 0.05,
  });
};

type CaptureSentryTxnError = (props: {
  error: any;
  walletPubkey?: string;
  transactionName?: string;
  params?: Dictionary<any>;
}) => void;

export const captureSentryTxnError: CaptureSentryTxnError = ({
  error,
  walletPubkey = '',
  transactionName = 'Unknown transaction',
  params = {},
}) => {
  Sentry.captureException(error, (scope) => {
    scope.clear();

    scope.setTransactionName(transactionName);

    if (walletPubkey) {
      scope.setUser({ id: walletPubkey });
      scope.setTag('wallet', walletPubkey);
    }

    scope.setTag('transaction', transactionName);

    scope.setExtra('Transaction params', JSON.stringify(params, null, ' '));
    error?.logs && scope.setExtra('Transaction logs: ', error.logs.join('\n'));

    return scope;
  });
};
