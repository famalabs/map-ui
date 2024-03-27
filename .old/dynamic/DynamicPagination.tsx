import React from 'react';
import TablePagination, { TablePaginationProps } from '@mui/material/TablePagination';
import { StaticTablePaginatedProps } from '../index';

interface IProps<T extends Record<string, any>>
  extends Pick<any, 'gotoPage' | 'pageCount' | 'setPageSize'> {
  totalRows: number;
  pageIndex: number;
  pageSize: number;
  rowsPerPageOptions: TablePaginationProps['rowsPerPageOptions'];
  changeSizeEvent?: StaticTablePaginatedProps<T>['paginationOptions']['changeSize'];
  dynamic?: {
    currentLength: number;
    //fetchRequest: IDynamicTablePaginatedProps<T>['fetchProps']['fetchRequest'];
  };
  localeObj?: Record<string, any>;
}

export function DynamicTablePagination<T extends Record<string, any>>(props: IProps<T>) {
  const {
    totalRows,
    gotoPage,
    pageIndex,
    pageSize,
    //pageCount,
    rowsPerPageOptions,
    setPageSize,
    changeSizeEvent,
    localeObj,
  } = props;

  return (
    <TablePagination
      component="div"
      count={totalRows}
      onPageChange={(_, page) => gotoPage(page)}
      page={pageIndex}
      rowsPerPage={pageSize}
      rowsPerPageOptions={rowsPerPageOptions}
      labelRowsPerPage={localeObj['elements']}
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${localeObj['of']} ${count}`}
      onRowsPerPageChange={(e) => {
        const size = Number(e.target.value);
        setPageSize(size);
        /* if (changeSizeEvent) changeSizeEvent(size);
        gotoPage(0); */
      }}
    />
  );
}
