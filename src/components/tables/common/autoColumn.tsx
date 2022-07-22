import React from 'react';
import { Column, FilterType } from 'react-table';
import { BooleanFilter, DateFilter, NumberFilter, SelectFilter, StringFilter } from '../filters';

function inferType(type: string, value?: unknown): string {
  if (type !== undefined) return type;

  switch (typeof value) {
    case 'boolean':
      return 'boolean';
    case 'number':
      return 'number';
    case 'bigint':
      return 'number';
    case 'string':
      //if (moment(value).isValid()) return 'date';
      return 'string';
    case 'object':
      break;
  }

  if (value instanceof Date) return 'date';

  return undefined;
}

export default function autoColumn<T extends Record<string, any>>(
  given?: Column<T>[],
  data?: T[]
): Column<T>[] {
  return given.map((col: any) => {
    const key = col.accessor;
    if (typeof key !== 'string' && col.type === undefined) return col;

    col.type = inferType(
      col.type,
      typeof key === 'string'
        ? data.find((obj) => obj[key] != null)
          ? data.find((obj) => obj[key] != null)[key]
          : null
        : null
    );
    if (!col.filterModel) {
      switch (col.type) {
        case 'string':
          col.filterModel = StringFilter();
          break;
        case 'boolean':
          col.filterModel = BooleanFilter();
          break;
        case 'number':
          col.filterModel = NumberFilter();
          break;
        case 'date':
          col.filterModel = DateFilter();
          break;
        case 'select':
          if (typeof key === 'string')
            col.filterModel = SelectFilter(
              data.reduce(
                (options, obj) => (options.includes(obj[key]) ? options : options.concat(obj[key])),
                []
              )
            );
          break;
      }
    }
    if (col.filterModel && !col.filter) col.filter = col.filterModel.tableFilter;
    if (!col.filterModel) col.disableFilters = true;
    return {
      disableGlobalFilter: col.type === 'boolean' || col.type === undefined,
      ...col,
    };
  });
}
