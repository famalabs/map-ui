import { useFilters, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import React from 'react';
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import TableContainer from "@mui/material/TableContainer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {
  CommonTable,
  HideColumns,
  TableFilters,
} from '.';
import { ITablePaginatedProps, itLocale, selectRowsColumnId } from '../utils';
import { DynamicTablePagination } from './DynamicPagination';
import autoColumn from './autoColumn';
import defaultColumn from './defaultColumn';
import filterTypes from './filterTypes';
import { DynamicTableFilters } from './DynamicFilters';

export interface IDynamicTablePaginatedProps<T extends Record<string, any>> extends ITablePaginatedProps<T> {
  setTableData: React.Dispatch<React.SetStateAction<T[]>>;
  fetchProps: {
    totalRows: number;
    fetchRequest: (pageSize: number, pageIndex?: number) => Promise<unknown>;
  };
}

export function DynamicTablePaginated<T extends Record<string, any>>(props: IDynamicTablePaginatedProps<T>) {

  const {
    tableProps: tableGivenProps,
    setTableData,
    loading,
    fetchProps,
    paginationOptions,
    hideColumnAction,
    onSingleRowClick,
    /* router */
    setSelected,
  } = props;


  const tableProps: any = React.useMemo(() => {
    return {
      columns: autoColumn(tableGivenProps.columns as any, tableGivenProps.data as any),
      initialState: {
        ...tableGivenProps.initialState,
        hiddenColumns: [selectRowsColumnId].concat(tableGivenProps.initialState?.hiddenColumns),
      },
      defaultColumn: defaultColumn(tableGivenProps.defaultColumn),
      filterTypes: filterTypes((tableGivenProps as any).filterTypes),
    };
  }, []);

  const [currentLocale, setCurrentLocale] = React.useState<Record<string, any>>(itLocale);

  const [controlledPageCount, setControlledPageCount] = React.useState<number>(0);
  React.useEffect(() => {
    const calculatedPageCount = Math.ceil(fetchProps.totalRows / (tableGivenProps as any).initialState.pageSize);
    setControlledPageCount(calculatedPageCount);
  }, [fetchProps.totalRows]);

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
    //toggleAllRowsSelected,
    state: { pageIndex, pageSize, filters, sortBy },
  }: any = useTable<T>(
    {
      ...tableProps,
      data: tableGivenProps.data,
      autoResetPage: false,
      autoResetSelectedRows: false,
      manualPagination: true,
      pageCount: controlledPageCount,
      manualFilters: true,
      manualSortBy: true,
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      setSelected &&
        hooks.visibleColumns.push((columns) => [
          {
            id: String(selectRowsColumnId),

            Header: ({ getToggleAllPageRowsSelectedProps, rows, state: { pageIndex, pageSize } }: any) => {
              const props = getToggleAllPageRowsSelectedProps();
              // delete props.indeterminate;
              const page = rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
              props.checked = page.every((row: any) => row.isSelected);
              props.indeterminate = page.some((row: any) => row.isSelected);
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

  /* Custom pagination */

  const page = React.useMemo(() => (
    rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  ), [rows, pageSize, pageIndex]);

  /* Load Next Page */

  React.useEffect(() => {
    if (tableGivenProps.data.length === 0) {
      fetchProps.fetchRequest(pageSize, 1);
      return;
    }

    if (!loading && !(fetchProps.totalRows === rows.length) && tableGivenProps.data.length < (pageIndex + 1) * pageSize) {
      fetchProps.fetchRequest(pageSize, pageIndex + 1);
      console.log("Data: ", tableGivenProps.data);
    }
  }, [pageIndex]);

  /* Handle pageSize change */
  React.useMemo(async () => {
    setTableData([]);
    gotoPage(0);
    if (!loading) await fetchProps.fetchRequest(pageSize, 1);
    console.log("Data: ", tableGivenProps.data);
  }, [pageSize]);

  React.useEffect(() => {
    if (setSelected) setSelected(selectedFlatRows.map((r) => r.original));
  }, [setSelected, selectedFlatRows]);

  React.useEffect(() => {
    console.log('Filters: ', filters);
    console.log('All columns: ', allColumns);
  }, [filters]);

  return (
    <>
      <HideColumns allColumns={allColumns} hideColumnAction={hideColumnAction} />
      <DynamicTableFilters
        filteredRowsLength={rows.length}
        preFilteredRowsLength={fetchProps.totalRows}
        filterColumnsIds={['available', 'status']}
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

              </Box>
            </Toolbar>
          </Box>
          <DynamicTablePagination
            totalRows={fetchProps.totalRows}
            pageIndex={pageIndex}
            pageSize={pageSize}
            rowsPerPageOptions={paginationOptions.pageSizes}
            pageCount={pageCount}
            gotoPage={gotoPage}
            setPageSize={setPageSize}
            changeSizeEvent={paginationOptions.changeSize}
            localeObj={currentLocale.pagination}
          />
        </Box>
      </TableContainer>
    </>
  );
}
