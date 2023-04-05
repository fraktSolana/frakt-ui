import axios from 'axios';

interface TopNotificationContent {
  html: string;
}

type FetchTopNotification = () => Promise<string>;
export const fetchTopNotification: FetchTopNotification = async () => {
  const { data } = await axios.get<TopNotificationContent>(
    `https://${process.env.BACKEND_DOMAIN}/web/top`,
  );

  return data?.html || '';
};
