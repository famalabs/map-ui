import React from 'react';
import { ColumnInterfaceBasedOnValue } from 'react-table';
import moment from 'moment';

export const DateCell: <T extends Record<string, any>>(
  format?: string
) => Extract<ColumnInterfaceBasedOnValue<T, string | Date>['Cell'], React.FC> = (format = 'DD/MM/yyyy') => ({
  value,
}) => {
  if (typeof value === 'undefined') return null;
  return <>{moment(value).format(format)}</>;
};
