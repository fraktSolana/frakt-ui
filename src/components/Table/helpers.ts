import classNames from 'classnames';
import { ActiveRowParams } from './types';

//TODO Rewrite this code!
export const getRowClassName = (record: any, params: ActiveRowParams) => {
  const DEFAULT_ROW_CLASSNAME = 'rowClassName';
  const ACTIVE_ROW_CLASSNAME = 'activeRowClassName';

  if (!params?.field)
    return classNames(DEFAULT_ROW_CLASSNAME, params?.className);

  const field = record[params.field];
  const value = params.value;

  if (!!field && !value) return params?.className;
  return value && field === value && ACTIVE_ROW_CLASSNAME;
};
