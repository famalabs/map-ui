import React from 'react';
import  {TablePagination, TablePaginationProps } from '@mui/material';
import { TableInstance } from 'react-table';
import { IDynamicTablePaginatedProps, StaticTablePaginatedProps } from '../index';

interface IProps<T extends Record<string, any>>
  extends Pick<any, 'gotoPage' | 'pageCount' | 'setPageSize'> {
  totalRows: number;
  pageIndex: number;
  pageSize: number;
  rowsPerPageOptions: TablePaginationProps['rowsPerPageOptions'];
  changeSizeEvent?: StaticTablePaginatedProps<T>['paginationOptions']['changeSize'];
  dynamic?: {
    currentLength: number;
    fetchRequest: IDynamicTablePaginatedProps<T>['fetchProps']['fetchRequest'];
  };
}

export function CommonTablePagination<T extends Record<string, any>>(props: IProps<T>) {
  const {
    totalRows,
    gotoPage,
    pageIndex,
    pageSize,
    pageCount,
    rowsPerPageOptions,
    setPageSize,
    changeSizeEvent,
    dynamic,
  } = props;

  return (
    <TablePagination
      component="div"
      count={totalRows}
      onPageChange={(_, page) => gotoPage(page)}
      page={pageIndex}
      rowsPerPage={pageSize}
      rowsPerPageOptions={rowsPerPageOptions}
      labelDisplayedRows={({ from, to, count, page }) =>
        `${from}-${to} of ${count} | Page ${page + 1} of ${pageCount}`
      }
      onRowsPerPageChange={(e) => {
        const size = Number(e.target.value);
        if (dynamic) if (!(totalRows === dynamic.currentLength)) dynamic.fetchRequest(size);
        setPageSize(size);
        if (changeSizeEvent) changeSizeEvent(size);
        gotoPage(0);
      }}
    />
  );
}
