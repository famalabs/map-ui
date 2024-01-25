import React from 'react';
import { ParsedUrlQuery, ParsedUrlQueryInput } from 'querystring';
import { ActionType, TableOptions, TableState } from 'react-table';
import { selectRowsColumnId } from '../utils';
import defaultColumn from './defaultColumn';
import filterTypes from './filterTypes';
import autoColumn from './autoColumn';

export const DefaultParent: React.FC = ({ children }:any) => <>{children}</>;

export interface IQueryParams extends ParsedUrlQuery {
  filters?: string[] | string;
  values?: string[] | string;
  sortBy?: string[] | string;
  desc?: string[] | string;
}

export function getQueryFromState({ filters, sortBy }: any): ParsedUrlQueryInput {
  return {
    filters: filters?.map((f) => f.id),
    values: filters?.map((f) => f.value),
    sortBy: sortBy?.map((s) => s.id),
    desc: sortBy?.map((s) => !!s.desc),
  };
}

export function getStateFromQuery(query: IQueryParams): any {
  // @ts-ignore
  const filters: TableState['filters'] = [];
  // @ts-ignore
  const sortBy: TableState['sortBy'] = [];

  if (query.filters) {
    if (typeof query.filters === 'string' && typeof query.values === 'string')
      filters.push({ id: query.filters, value: query.values });
    else if (
      typeof query.filters === 'object' &&
      typeof query.values === 'object' &&
      query.filters.length === query.values.length
    ) {
      const values = query.values;
      query.filters.forEach((id, index) => filters.push({ id, value: values[index] }));
    }
  }
  if (query.sortBy) {
    if (typeof query.sortBy === 'string' && typeof query.desc === 'string')
      sortBy.push({ id: query.sortBy, desc: query.desc === 'true' });
    else if (
      typeof query.sortBy === 'object' &&
      typeof query.desc === 'object' &&
      query.sortBy.length === query.desc.length
    ) {
      const desc = query.desc;
      query.sortBy.forEach((id, index) => sortBy.push({ id, desc: desc[index] === 'true' }));
    }
  }

  return { filters, sortBy };
}

export function commonTableProps(
  givenProps: any,
  query?: IQueryParams
): any {
  const initialState = 0 ? getStateFromQuery(query) : {};
  return {
    disableMultiSort: true,
    autoResetSelectedRows: false,
    ...givenProps,
    columns: autoColumn(givenProps.columns as any, givenProps.data as any),
    initialState: {
      ...initialState,
      ...givenProps.initialState,
      hiddenColumns: [selectRowsColumnId].concat(givenProps.initialState?.hiddenColumns),
    },
    stateReducer: (newState: any, action: ActionType) => {
      if(newState.filters.length > 0) {
        action.type == 'resetPage' ? newState.pageIndex = 0 : null;
      } 
      return newState;
    },
    defaultColumn: defaultColumn(givenProps.defaultColumn),
    filterTypes: filterTypes(givenProps.filterTypes as any),
  };
}
