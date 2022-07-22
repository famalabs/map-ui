
import { TableOptions, useFilters, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import React from 'react';
import { Paper, Checkbox, TableContainer, Box, Toolbar, FormControlLabel } from '@mui/material';
import {
  CommonTable,
  CommonTablePagination,
  HideColumns,
  TableFilters,
  commonTableProps,
  getQueryFromState,
} from './common';
import { ITablePaginatedProps, selectRowsColumnId } from './utils';

export interface IDynamicTablePaginatedProps<T extends Record<string, any>> extends ITablePaginatedProps<T> {
  fetchProps: {
    totalRows: number;
    fetchRequest: (size: number) => Promise<unknown>;
  };
}

export function DynamicTablePaginated<T extends Record<string, any>>(props: IDynamicTablePaginatedProps<T>) {
  const {
    tableProps: tableGivenProps,
    loading,
    fetchProps,
    paginationOptions,
    hideColumnAction,
    onSingleRowClick,
    router: { query, setQuery },
    setSelected,
  } = props;

  const tableProps: any = React.useMemo(() => {
    (tableGivenProps as any).manualPagination = true;
    (tableGivenProps as any).manualFilters = true;
    (tableGivenProps as any).manualSortBy = true;

    return commonTableProps(tableGivenProps, query);
  }, [tableGivenProps]);

  // @ts-ignore
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    allColumns,
    visibleColumns,
    selectedFlatRows,

    gotoPage,
    setPageSize,
    pageCount,
    setAllFilters,
    toggleAllRowsSelected,

    state: { pageIndex, pageSize, filters, sortBy },
  }:any = useTable<T>(tableProps, useFilters, useSortBy, usePagination, useRowSelect, (hooks) => {
    setSelected &&
      hooks.visibleColumns.push((columns) => [
        {
          id: String(selectRowsColumnId),
          Header: ({ getToggleAllPageRowsSelectedProps, rows, state: { pageIndex, pageSize } }:any) => {
            const props = getToggleAllPageRowsSelectedProps();
            // delete props.indeterminate;
            const page = rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
            props.checked = page.every((row:any) => row.isSelected);
            props.indeterminate = page.some((row:any) => row.isSelected);
            return (
              <Checkbox
                {...props}
                onChange={(e) => page.forEach((row) => row.toggleRowSelected(e.target.checked))}
              />
            );
          },
          Cell: ({ row }) => <Checkbox {...row.getToggleRowSelectedProps()} />,
        },
        ...columns,
      ]);
  });

  const page = React.useMemo(() => rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize), [
    rows,
    pageSize,
    pageIndex,
  ]);

  React.useEffect(() => {
    // load next page
    if (
      !loading &&
      !(fetchProps.totalRows === rows.length) &&
      tableProps.data.length < (pageIndex + 2) * pageSize
    )
      fetchProps.fetchRequest(pageSize).finally();
  }, [pageIndex, pageSize, loading]);

  React.useEffect(() => {
    setQuery(getQueryFromState({ filters, sortBy }));
  }, [filters, sortBy]);

  React.useEffect(() => {
    if (setSelected) setSelected(selectedFlatRows.map((r) => r.original));
  }, [setSelected, selectedFlatRows]);

  return (
    <>
      <HideColumns allColumns={allColumns} hideColumnAction={hideColumnAction} />
      <TableFilters
        filteredRowsLength={rows.length}
        preFilteredRowsLength={fetchProps.totalRows}
        visibleColumns={visibleColumns}
        filterLength={filters.length}
        clearFilters={() => setAllFilters([])}
      />
      <TableContainer component={Paper}>
        <CommonTable
          {...{
            pageSize,
            onSingleRowClick,
            visibleColumns,
            headerGroups,
            getTableProps,
            getTableBodyProps,
            prepareRow,
            page,
            loading,
          }}
        />
        <Box display="flex" p={1} padding={0}>
          <Box p={1} flexGrow={1} padding={0}>
            <Toolbar style={{ alignItems: 'center', minHeight: '52px' }}>
              <Box component="span">
                Selected items: {selectedFlatRows.length} / {fetchProps.totalRows}
              </Box>
            </Toolbar>
          </Box>
          <CommonTablePagination
            totalRows={fetchProps.totalRows}
            pageIndex={pageIndex}
            pageSize={pageSize}
            rowsPerPageOptions={paginationOptions.pageSizes}
            pageCount={pageCount}
            gotoPage={gotoPage}
            setPageSize={setPageSize}
            changeSizeEvent={paginationOptions.changeSize}
            dynamic={{
              currentLength: rows.length,
              fetchRequest: fetchProps.fetchRequest,
            }}
          />
        </Box>
      </TableContainer>
    </>
  );
}
