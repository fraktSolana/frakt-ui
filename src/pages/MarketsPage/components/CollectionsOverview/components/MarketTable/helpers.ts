export const getStorageItemsByKey = (key: string) => {
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const setItemsToStorageByKey = (key: string, items: any) => {
  localStorage.setItem(key, JSON.stringify(items));
};
