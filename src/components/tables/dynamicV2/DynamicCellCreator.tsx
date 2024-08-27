import TableCell from '@mui/material/TableCell';
import React from 'react';
import { DynColumnsDef } from './DynamicTypes';

export interface DynamicCellProps<T> {
  row: T;
  column: DynColumnsDef<T>;
}

export function DynamicCellCreator<T extends Record<string, any>>(props: DynamicCellProps<T>) {

  const { row, column } = props;

  /* Extract potential nested objects values */
  const getNestedProperty = (row: T, path: string,) => {
    return path.split('.').reduce((nestedObject, property) => {
      return (nestedObject && property in nestedObject)
        ? nestedObject[property]
        : '';
    }, row) ?? '';
  };

  const cellValue = getNestedProperty(row, column.accessor);

  switch (true) {

    case 'Cell' in column && column.Cell !== undefined:
      const CustomCell = column.Cell;
      return (
        <TableCell
          sx={{ width: 160 }}
        >
          <CustomCell cellValue={cellValue} currentColumn={column} currentRow={row} />
        </TableCell>
      );

    default:
      return <TableCell style={{ width: 160 }}>{cellValue}</TableCell>;
  }

}