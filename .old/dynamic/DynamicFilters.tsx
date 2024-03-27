import Button from '@mui/material/Button';
import React from 'react';
import { ColumnInstance } from 'react-table';

interface IProps<T extends Record<string, any>> {
  filteredRowsLength: number;
  preFilteredRowsLength: number;
  filterColumnsIds: string[];
  visibleColumns: ColumnInstance<T>[];
  filterLength: number;
  clearFilters: () => void;
}

export function DynamicTableFilters<T extends Record<string, any>>(props: IProps<T>) {
  const { filteredRowsLength, preFilteredRowsLength, filterColumnsIds, visibleColumns, filterLength, clearFilters } = props;
  return (
    <div>
      {visibleColumns.map((column: any) =>
        filterColumnsIds.includes(column.id) ? <span key={column.id}>{column.render('Filter')} </span> : null
      )}
      <Button disabled={filterLength === 0} onClick={clearFilters}>
        Reset
      </Button>
    </div>
  );
}
