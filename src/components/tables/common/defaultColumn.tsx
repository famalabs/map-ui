import React from 'react';
import { Column, TableOptions } from 'react-table';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField'

import { BooleanCell, DateCell } from '../cells';
import { selectRowsColumnId } from '../utils';
import moment from 'moment';

export default function defaultColumn<T extends Record<string, any>>(
  given?: Partial<Column<T>>
): Partial<any> {

  function Trim(str) {

    if (str && str.length > 15) {
      return str.substring(0, Math.min(15,str.length)) + '...';
       
    } else return str;

  }

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
          return BooleanCell()(props);
        case 'date':
          return DateCell()(props);
      }
      return Trim(props.value) ?? '';
    },
    ...given,
  };
}
