import React from 'react';
import { ActionType } from 'react-table';
import { selectRowsColumnId } from '../utils';
import defaultColumn from './defaultColumn';
import filterTypes from './filterTypes';
import autoColumn from './autoColumn';

export const DefaultParent: React.FC = ({ children }: any) => <>{children}</>;

export function getQueryFromState({ filters, sortBy, pageIndex }: any): string {

  const conditionMap = {
    "=": "equals",
    "!=": "not-equals",
    ">": "greater-than",
    "<": "less-than",
    ">=": "greater-than-equals",
    "<=": "less-than-equals"
  };

  const filterQueryString = filters?.map((filter: { value: Record<string, any>[]; id: string; }) => {

    return filter.value.map((f) => {

      const formattedCond = conditionMap[f.cond] || f.cond;
      return `filter[${filter.id}]=${formattedCond},${f.value}`;

    }).join('&');

  }).join('&') as string ?? '';

  const querySortBy = sortBy.length > 0 ? sortBy[0].id as string : '';
  const queryOrder = sortBy.length > 0 ? (sortBy[0].desc ? 'desc' : 'asc') as string : '';
  const sortByQueryString = querySortBy ? `sort=${querySortBy}&order=${queryOrder}` : '';

  const pageIndexQueryString = pageIndex ? `page=${pageIndex + 1}` : '';

  return [filterQueryString, sortByQueryString, pageIndexQueryString].filter(element => element).join('&');
}


export function getStateFromQuery(queryEntries: IterableIterator<[string, string]>) {
  //const testParams = new URLSearchParams('filter[name]=not-contains,2&filter[name]=not-equals,3&filter[qty]=less-than-equals,1&sort=available&order=desc&page=2');

  const filtersQuery = [] as Record<string, any>[];
  const sortByQuery = {} as Record<string, any>;
  let pageIndexQuery: number;

  const conditionMap = {
    "equals": "=",
    "not-equals": "!=",
    "greater-than": ">",
    "less-than": "<",
    "greater-than-equals": ">=",
    "less-than-equals": "<="
  };

  const decoderMap = {
    filter: ([key, value]: [string, string]) => {
      filtersQuery.push({
        id: key.split('[')[1].split(']')[0],
        value: value.split(',').map(v => conditionMap[v] || v),
      });
    },
    sort: ([, value]: [string, string]) => {
      sortByQuery.id = value;
    },
    order: ([, value]: [string, string]) => {
      sortByQuery.desc = value === 'desc';
    },
    page: ([, value]: [string, string]) => {
      pageIndexQuery = parseInt(value) - 1;
    },
  };

  for (const entry of queryEntries) {
    // takes the 'filter' in 'filter[name] as a key'
    const key = entry[0].split('[')[0];
    if (decoderMap[key]) decoderMap[key](entry);
  }

  return {
    filters: [...filtersQuery],
    sortBy: [sortByQuery],
    pageIndex: pageIndexQuery,
  };
}

export function commonTableProps(
  givenProps: any,
  queryEntries?: IterableIterator<[string, string]>,
): any {
  const initialState = 0 ? getStateFromQuery(queryEntries) : {};

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
      if (action.type === 'gotoPage') {
        newState.pageIndex = action.pageIndex;
        return newState;
      } else if (action.type !== 'setAllFilters') {
        newState.pageIndex = givenProps.initialState.pageIndex ?? 0;
        return newState;
      }
    },
    useControlledState: (state) => {
      return React.useMemo(
        () => ({
          ...state,
        }), [state])
    },
    autoResetPage: false,
    defaultColumn: defaultColumn(givenProps.defaultColumn),
    filterTypes: filterTypes(givenProps.filterTypes as any),
  };
}
