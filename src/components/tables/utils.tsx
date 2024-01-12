import React from 'react';
import { Row, TableOptions } from 'react-table';
import { IQueryParams } from './common';
import { ParsedUrlQueryInput } from 'querystring';

export type IActionType = 'add' | 'delete';
export interface IAction {
  type: IActionType;
  text?: string;
  icon?: React.ReactNode;
  onlyIcon?: boolean;
}

export interface ITablePaginatedProps<T extends Record<string, any>> {
  tableProps: TableOptions<T>;
  actionList: IAction[],
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
  onAction: (action: IActionType, selectedItems: any) => unknown;
  setSelected?: (objs: T[]) => void;
  container?: React.ElementType;
}

export const selectRowsColumnId = 'SelectRowsColumn';
