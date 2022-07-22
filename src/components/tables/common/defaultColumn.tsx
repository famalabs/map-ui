import React from 'react';
import { Column, TableOptions } from 'react-table';
import { TableSortLabel, TextField, IconButton } from '@mui/material';
import { BooleanCell, DateCell } from '../cells';
import { selectRowsColumnId } from '../utils';
import moment from 'moment';

export default function defaultColumn<T extends Record<string, any>>(
  given?: Partial<Column<T>>
): Partial<any> {
  return {
    Filter: ({ column: { filterValue, setFilter, id, name } }) => {
      return (
        <TextField
          name={name}
          id={id}
          type="search"
          value={filterValue || ''}
          label={name ?? id}
          onChange={(e) => {
            setFilter(e.target.value || '');
          }}
        />
      );
    },
    Header: ({ column }) => (
      <>
        {column.canSort ? (
          <TableSortLabel
            active={column.isSorted}
            direction={column.isSortedDesc ? 'desc' : 'asc'}
            onFocus={(e) => e.target.blur()}
            {...column.getSortByToggleProps()}
          >
            {column.name ?? ''}
          </TableSortLabel>
        ) : (
          column.name ?? ''
        )}
      </>
    ),
    Cell: (props) => {
      switch (props.column.type) {
        case 'boolean':
          return BooleanCell(props);
        case 'date':
          return DateCell(props);
      }
      return props.value ?? '';
    },
    ...given,
  };
}
