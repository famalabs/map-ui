import TableCell from '@mui/material/TableCell';
import React from 'react';
import { DynColumnsDef } from './DynamicTypes';

export function DynamicCellCreator<T extends Record<string, any>>(row: T, column: DynColumnsDef, index: number) {

  const cellCases = ['action', 'avatar', 'boolean', 'date', 'image', 'link', 'status', 'select']

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

    case column.type === 'string' || 'number':
      return <TableCell key={index} style={{ width: 160 }}>{cellValue}</TableCell>;

    case cellCases.includes(column.type):
      const CustomCell = column.Cell({ cellValue });
      return <TableCell key={index} style={{ width: 160 }}>{CustomCell}</TableCell>;

    default:
      return <TableCell key={index} style={{ width: 160 }}>{cellValue}</TableCell>;
  }

}