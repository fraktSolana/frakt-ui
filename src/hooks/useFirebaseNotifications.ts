import { useEffect } from 'react';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.FCM_API_KEY,
  authDomain: process.env.FCM_AUTH_DOMAIN,
  databaseURL: process.env.FCM_DATABASE_URL,
  projectId: process.env.FCM_PROJECT_ID,
  storageBucket: process.env.FCM_STORAGE_BUCKET,
  messagingSenderId: process.env.FCM_MESSSAGING_SENDER_ID,
  appId: process.env.FCM_APP_ID,
  measurementId: process.env.FCM_MEASUREMENT_ID,
};

export const useFirebaseNotifications = (): void => {
  const wallet = useWallet();
  useEffect(() => {
    if (wallet.publicKey && 'serviceWorker' in navigator) {
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      getToken(messaging, { vapidKey: process.env.FCM_VAPID })
        .then((token) => {
          axios.post(`https://${process.env.BACKEND_DOMAIN}/web`, {
            token,
            user: wallet.publicKey.toBase58(),
            type: 'all',
          });
        })
        .catch(() => {});

      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(() => {})
        .catch(() => {});
    }
  }, [wallet]);
};
