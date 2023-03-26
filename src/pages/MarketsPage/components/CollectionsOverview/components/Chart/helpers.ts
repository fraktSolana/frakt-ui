import { colorByPercentOffers, getColorByPercent } from '@frakt/utils/bonds';

const renderCertainColorsByData = (data: number[]) => {
  return data.map((value) => getColorByPercent(value, colorByPercentOffers));
};

const getTooltipBackgroundColor = () => {
  const styles = getComputedStyle(document.body);
  const tooltipBackgroundColor = styles.getPropertyValue('--primary-border');

  return tooltipBackgroundColor;
};

export { renderCertainColorsByData, getTooltipBackgroundColor };
