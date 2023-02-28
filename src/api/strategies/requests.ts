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
  await axios.post(`https://${tetsApi}/trade-pools`, settings);
};

export const setImageTradePools = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('https://api.frakt.xyz/image/upload', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};

export const updateTradePools = async (settings) => {
  const response = await axios.patch(
    `https://${tetsApi}/trade-pools`,
    settings,
  );

  if (!response.data) {
    throw new Error('Network response was not ok');
  }
  return response;
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
