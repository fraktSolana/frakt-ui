import { BaseOptionType } from 'antd/lib/select';

export const filterOption = (inputValue: string, option: BaseOptionType) =>
  option?.value?.toUpperCase().includes(inputValue?.toUpperCase());

export const getPopupContainer = (triggerNode) => {
  return triggerNode.parentNode;
};
