export const formatSortOrderToNormalValue = (order: string) => {
  if (order === 'ascend') return 'asc';
  if (order === 'descend') return 'desc';
  return order;
};
