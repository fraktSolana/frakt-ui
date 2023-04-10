import moment from 'moment';

import { colorByPercentOffers, getColorByPercent } from '@frakt/utils/bonds';
import { MarketHistory } from '@frakt/api/bonds';

const renderCertainColorsByData = (data: number[]): string[] => {
  return data.map((value) => getColorByPercent(value, colorByPercentOffers));
};

const getComputedStyleByVaraible = (varaible: string): string => {
  const styles = getComputedStyle(document.body);
  const value = styles.getPropertyValue(varaible);
  return value;
};

const formatTimeToDayAndMonth = ({ time }: { time: string }) =>
  moment(time).format('M/D');

const formatTimeToTooltipData = (time: string) => moment(time).format('D MMMM');

const getMarketHistoryInfo = (data: MarketHistory[]) => {
  const labels = data.map(formatTimeToDayAndMonth);
  const highestLTVs = data.map(({ highestLTV }) => highestLTV);
  const activeLoans = data.map(({ activeBonds }) => activeBonds);

  return {
    labels,
    highestLTVs,
    activeLoans,
  };
};

export {
  renderCertainColorsByData,
  getComputedStyleByVaraible,
  formatTimeToDayAndMonth,
  formatTimeToTooltipData,
  getMarketHistoryInfo,
};
