import React from 'react';
import { Row, TableOptions } from 'react-table';
import { IQueryParams } from './common';
import { ParsedUrlQueryInput } from 'querystring';

export interface ITablePaginatedProps<T extends Record<string, any>> {
  tableProps: TableOptions<T>;
  loading: boolean;
  paginationOptions: {
    pageSizes: number[];
    changeSize?: (size: number) => void;
  };
  hideColumnAction?: (columnId: string) => void;
  onSingleRowClick?: (row: Row<T>) => void;
  router?: {
    query: IQueryParams;
    setQuery: (query: ParsedUrlQueryInput) => void;
  };
  setSelected?: (objs: T[]) => void;
  container?: React.ElementType;
}

export const selectRowsColumnId = 'SelectRowsColumn';
