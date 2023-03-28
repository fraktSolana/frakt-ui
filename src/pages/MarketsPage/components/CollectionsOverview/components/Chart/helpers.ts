import { colorByPercentOffers, getColorByPercent } from '@frakt/utils/bonds';

const renderCertainColorsByData = (data: number[]): string[] => {
  return data.map((value) => getColorByPercent(value, colorByPercentOffers));
};

const getComputedStyleByVaraible = (varaible: string): string => {
  const styles = getComputedStyle(document.body);
  const value = styles.getPropertyValue(varaible);
  return value;
};

export { renderCertainColorsByData, getComputedStyleByVaraible };
