import axios from 'axios';

export const fetchTradePools = async ({ walletPublicKey }): Promise<any> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/trade-pools?wallet=${walletPublicKey}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const createTradePools = async (settings) => {
  await axios.post(
    `https://${process.env.BACKEND_DOMAIN}/settings/trade-pools`,
    settings,
  );
};

export const setImageTradePools = async (settings) => {
  await axios.post(
    `https://${process.env.BACKEND_DOMAIN}/image/upload`,
    settings,
  );
};

export const updateTradePools = async (settings) => {
  await axios.patch(
    `https://${process.env.BACKEND_DOMAIN}/settings/trade-pools`,
    settings,
  );
};

export const fetchAdminTradePools = async ({
  walletPublicKey,
}): Promise<any> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/trade-pools/admin?wallet=${walletPublicKey}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};
