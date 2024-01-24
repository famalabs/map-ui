import React from 'react';
import { Row, TableOptions } from 'react-table';
import { IQueryParams } from './common';
import { ParsedUrlQueryInput } from 'querystring';

export const itLocale: Record<string, any> = {
  "globalfilter": "Cerca",
  "quickactions": {
    "name": "Azioni Veloci",
    "columns": "Colonne",
    "selected": "Selelzionati",
    "selectall": "Seleziona tutti",
    "actions": {
      "add": "Aggiungi",
      "remove": "Rimuovi"
    }
  },
  "dynfilter": {
    "name": "Filtro",
    "title": "Scegli i filtri",
    "column": "Colonna",
    "condition": "Condizione",
    "value": "Valore",
    "active": "attivi",
    "found": "trovati",
    "add": "Aggiungi Filtro",
    "remove": "Rimuovi tutti"
  },
  "pagination": {
    "elements": "Elementi mostrati",
    "page": "Pagina",
    "of": "di",
  }
}

export const enLocale: Record<string, any> = {
  "globalfilter": "Search",
  "quickactions": {
    "name": "Quick Actions",
    "columns": "Columns",
    "selected": "Selected",
    "selectall": "Select All",
    "actions": {
      "add": "Add",
      "remove": "Remove"
    }
  },
  "dynfilter": {
    "name": "Filter",
    "title": "Choose Filters",
    "column": "Column",
    "condition": "Condition",
    "value": "Value",
    "active": "Active",
    "found": "Found",
    "add": "Add Filter",
    "remove": "Remove All"
  },
  "pagination": {
    "elements": "Displayed Elements",
    "page": "Page",
    "of": "of"
  }
}

export type IActionType = 'add' | 'delete';
export interface IAction {
  type: IActionType;
  text?: string;
  icon?: React.ReactNode;
  onlyIcon?: boolean;
}

export interface ITablePaginatedProps<T extends Record<string, any>> {
  container?: React.ElementType;
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
  onPageChange?: (page: number) => void;
  defaultLocale?: 'it' | 'en';
  alternateLocale?: Record<string, any>;
}

export const selectRowsColumnId = 'SelectRowsColumn';
