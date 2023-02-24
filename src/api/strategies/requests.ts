import axios from 'axios';

const tetsApi = 'fraktion-monorep-test.herokuapp.com';

export const fetchTradePools = async ({ walletPublicKey }): Promise<any> => {
  const response = await fetch(
    `https://${tetsApi}/trade-pools?wallet=${walletPublicKey}`,
  );

  // if (!response.ok) {
  //   throw new Error('Network response was not ok');
  // }
  return await response.json();
};

export const createTradePools = async (settings) => {
  const response = await axios.post(`https://${tetsApi}/trade-pools`, settings);

  console.log(response);

  // if (response.status !== 201) {
  //   throw new Error('Network response was not ok');
  // }
};

export const setImageTradePools = async (settings) => {
  const response = await axios.post(
    `https://${process.env.BACKEND_DOMAIN}/image/upload`,
    settings,
  );

  console.log(response);

  if (response.status !== 200) {
    throw new Error('Network response was not ok');
  }
};

export const updateTradePools = async (settings) => {
  await axios.patch(`https://${tetsApi}/trade-pools`, settings);
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
