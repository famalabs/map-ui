import React from 'react';
import { ColumnInstance } from 'react-table';
import { selectRowsColumnId } from '../utils';
import  Button  from '@mui/material/Button';
import { QuickIcon } from './Table';

interface IProps<T extends Record<string, any>> {
  allColumns: ColumnInstance<T>[];
  deselectRows: () => void;
  localeObj: Record<string, any>;
}

export function TableSelect<T extends Record<string, any>>({
  allColumns,
  deselectRows,
  localeObj,
}: IProps<T>): JSX.Element {
  const selectColumn = React.useMemo(() => allColumns.find(({ id }) => id === selectRowsColumnId), [
    allColumns,
  ]);
  const onClick = React.useCallback(() => {
    selectColumn.toggleHidden();
    deselectRows();
  }, [selectColumn, deselectRows]);
  return (
    <Button
      aria-controls="fade-menu"
      aria-haspopup="true"
      style={{ marginRight: 15 }}
      onClick={onClick}
      variant={selectColumn.isVisible ? 'contained' : 'text'}
      color={selectColumn.isVisible ? 'secondary' : 'inherit'}
    >
      <QuickIcon style={{ marginRight: 10 }} />
      {localeObj['name']}
    </Button>
  );
}
