import React from 'react';
import { TableOptions, useTable, Row } from 'react-table';
import { Paper, TableContainer } from '@mui/material';
import { CommonTable, commonTableProps } from './common';

export interface SimpleTableProps<T extends Record<string, any>> {
  tableProps: TableOptions<T>;
  loading?: boolean;
  onSingleRowClick?: (row: Row<T>) => void;
  container?: React.ElementType;
}

export function SimpleTable<T extends Record<string, any>>(props: SimpleTableProps<T>) {
  const { tableProps: tableGivenProps, loading, onSingleRowClick, container } = props;

  const tableProps: TableOptions<T> = React.useMemo(() => commonTableProps(tableGivenProps), [
    tableGivenProps,
  ]);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, visibleColumns } = useTable<T>(
    tableProps
  );

  return (
    <>
      <TableContainer component={container as any}>
        <CommonTable
          page={rows}
          pageSize={rows.length}
          {...{
            visibleColumns,
            onSingleRowClick,
            headerGroups,
            getTableProps,
            getTableBodyProps,
            prepareRow,
            loading,
          }}
        />
      </TableContainer>
    </>
  );
}
