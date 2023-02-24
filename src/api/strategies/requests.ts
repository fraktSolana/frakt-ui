import axios from 'axios';

const tetsApi = 'fraktion-monorep-test.herokuapp.com';

export const fetchTradePools = async ({ walletPublicKey }): Promise<any> => {
  const response = await fetch(
    `https://${tetsApi}/trade-pools?wallet=${walletPublicKey}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const createTradePools = async (settings) => {
  await axios.post(`https://${tetsApi}/settings/trade-pools`, settings);
};

export const setImageTradePools = async (settings) => {
  await axios.post(`https://${tetsApi}/image/upload`, settings);
};

export const updateTradePools = async (settings) => {
  await axios.patch(`https://${tetsApi}/settings/trade-pools`, settings);
};

export const fetchAdminTradePools = async ({
  walletPublicKey,
}): Promise<any> => {
  const response = await fetch(
    `https://${tetsApi}/trade-pools/admin?wallet=${walletPublicKey}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};
