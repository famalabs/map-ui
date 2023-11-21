import  Button from '@mui/material/Button';
import React from 'react';
import { ColumnInstance } from 'react-table';

interface IProps<T extends Record<string, any>> {
  filteredRowsLength: number;
  preFilteredRowsLength: number;
  visibleColumns: ColumnInstance<T>[];
  filterLength: number;
  clearFilters: () => void;
}

export function TableFilters<T extends Record<string, any>>(props: IProps<T>) {
  const { filteredRowsLength, preFilteredRowsLength, visibleColumns, filterLength, clearFilters } = props;
  return (
    <div>
      Filters ({`${filteredRowsLength} results over ${preFilteredRowsLength} objects`})
      <br />
      {visibleColumns.map((column: any) =>
        column.canFilter ? <span key={column.id}>{column.render('Filter')} </span> : null
      )}
      <Button disabled={filterLength === 0} onClick={clearFilters}>
        Reset
      </Button>
    </div>
  );
}
