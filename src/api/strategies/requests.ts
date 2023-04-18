import axios from 'axios';
import {
  Settings,
  TradePoolAdmin,
  TradePoolStats,
  TradePoolUser,
} from './types';

const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN;

export const fetchTradePoolStats = async ({
  walletPublicKey,
}: {
  walletPublicKey: string;
}): Promise<TradePoolStats[]> => {
  const response = await fetch(
    `https://${BACKEND_DOMAIN}/trade-pools/stats/${walletPublicKey}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchTradePools = async ({
  walletPublicKey,
}: {
  walletPublicKey: string;
}): Promise<TradePoolUser[]> => {
  const walletQuery = walletPublicKey ? `?wallet=${walletPublicKey}` : '';

  const response = await fetch(
    `https://${BACKEND_DOMAIN}/trade-pools${walletQuery}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const createTradePools = async (settings: Settings) => {
  const response = await axios.post(
    `https://${BACKEND_DOMAIN}/trade-pools`,
    settings,
  );

  if (!response.data) {
    throw new Error('Network response was not ok');
  }
};

export const setImageTradePools = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`https://${BACKEND_DOMAIN}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};

export const updateTradePools = async (settings: Settings) => {
  const response = await axios.patch(
    `https://${BACKEND_DOMAIN}/trade-pools`,
    settings,
  );

  if (!response.data) {
    throw new Error('Network response was not ok');
  }
  return response;
};

export const fetchAdminTradePools = async ({
  walletPublicKey,
}: {
  walletPublicKey: string;
}): Promise<TradePoolAdmin[]> => {
  const response = await fetch(
    `https://${BACKEND_DOMAIN}/trade-pools/admin?wallet=${walletPublicKey}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};
