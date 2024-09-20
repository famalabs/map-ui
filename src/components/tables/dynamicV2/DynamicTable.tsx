import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Grid2 from "@mui/material/Unstable_Grid2";
import qs from 'qs';
import React, { useEffect, useRef, useState } from 'react';
import { DynamicActionHeader } from './DynamicActionHeader';
import { CommonBodyCreator } from './DynamicCommons';
import { DynamicSimpleFilters } from './DynamicFilters';
import { TablePaginationActions } from './DynamicPagination';
import { ActiveFilter, DefineActionsProps, DynColumnsDef, DynamicTableProps, QueryInfoProps } from './DynamicTypes';
import { en_locale, it_locale } from './DynamicTableLocale';

export function DynamicTable<T extends Record<string, any>>(props: DynamicTableProps<T>) {

  const {
    tableInfo: {
      tableName,
      tableData,
      columns,
      expectedRowCount,
      staticMode = false,
      emptyTablePlaceholderSrc,
      emptyTablePlaceholderText,
      showVisibleColumnsButton = true,
      paginationOptions: {
        customPageRowCount,
        customSelectPages,
        autoSizeHeight = false,
        hideFooter = false,
      } = {},
    },
    fetchInfo: {
      fetchData,
      isFetching
    },
    queryInfo: {
      onLoadQuery,
      setCurrentQuery
    } = {} as QueryInfoProps,
    defineActions = {} as DefineActionsProps<T>,
    onRowClick,
    newItemButton,
    tableLocale = 'en',
    localeStr,
  } = props;

  /* Page index */
  const [page, setPage] = useState<number>(0);

  /* Rows displayed per page */
  const savedRowsPerPage = localStorage.getItem(`${tableName}-rowsPerPage`);
  const [rowsPerPage, setRowsPerPage] = useState<number>(customPageRowCount ? (parseInt(savedRowsPerPage, 10) || customPageRowCount) : expectedRowCount);

  /* Highest fetched page */
  const [highestFetchedPage, setHighestFetchedPage] = useState<number>(-1);

  /* Active filters object */
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  /* Visible columns state (define structure later) */
  const localVisibleCols = localStorage.getItem(tableName);
  const [visibleColumns, setVisibleColumns] = useState<DynColumnsDef<T>[]>([]);

  /* Quick actions */
  const [quickActions, setQuickActions] = useState<boolean>(false);
  const [quickSelectedRows, setQuickSelectedRows] = useState<T[]>([]);

  /* Has the fetch function been called */
  const [hasDataFetched, setHasDataFetched] = useState<boolean>(false);

  /* Has table loaded */
  const [hasTableLoaded, setHasTableLoaded] = useState<boolean>(false);

  /* Selected locale */
  const selectedLocale = tableLocale === 'it' ? it_locale : en_locale;

  /* Fetching event function */
  const fetchEvent = async (firstLoad: boolean = false) => {
    if (firstLoad || highestFetchedPage < page) {
      await fetchData(rowsPerPage, activeFilters, firstLoad);
      setHasDataFetched(true);
      setHighestFetchedPage(firstLoad ? 0 : page);
    }
  }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    localStorage.setItem(`${tableName}-rowsPerPage`, event.target.value);
    setPage(0);
    setHighestFetchedPage(-1);
  };

  /* Update visible columns state */
  useEffect(() => {

    if (localVisibleCols) {

      const parsedVisibleCols = JSON.parse(localVisibleCols) as { accessor: string, visible: boolean }[];

      setVisibleColumns(columns.map(column => {
        const localColumn = parsedVisibleCols.find(localCol => localCol.accessor === column.accessor);
        return { ...column, visible: localColumn ? localColumn.visible : column.visible ?? false };
      }));

    } else setVisibleColumns(columns);

  }, [columns]);


  /* Load filters from querystring */
  useEffect(() => {
    if (onLoadQuery) {
      const parsedObject = qs.parse(onLoadQuery, { ignoreQueryPrefix: true });
      const filterQuery = parsedObject.filter as Record<string, any> ?? {} as Record<string, any>;

      const updatedActiveFilters = Object.entries(filterQuery).map(([filterColumn, filterValue]) => {

        const selectColumn = columns.find(column => (column.filterOptions && column.filterOptions.type === 'select') && column.accessor === filterColumn);

        switch (typeof selectColumn?.filterOptions.options[0].id) {
          case 'string':
            return { filterColumn, filterValue } as ActiveFilter;
          case 'number':
            return { filterColumn, filterValue: Number(filterValue) } as ActiveFilter;
          case 'boolean':
            return { filterColumn, filterValue: JSON.parse(filterValue.toLowerCase()) } as ActiveFilter;
          default:
            return { filterColumn, filterValue } as ActiveFilter;
        }

      });

      setActiveFilters(updatedActiveFilters);
    }
  }, []);

  /* Fetch event effects when page & rowsPerPage change  */

  useEffect(() => {
    /* Skip fetch is static mode is enabled */
    if (page !== 0 && !staticMode) fetchEvent();
  }, [page]);

  useEffect(() => {
    /* Skip fetch is static mode is enabled */
    if (hasTableLoaded && !staticMode) fetchEvent(true);
  }, [rowsPerPage]);

  /* Parse filter query */
  const parseFilterQuery = () => {
    if (setCurrentQuery) {

      const filterQuery = activeFilters.reduce((obj, filter) => {
        obj[`filter[${filter.filterColumn}]`] = filter.filterValue;
        return obj;
      }, {});

      setCurrentQuery(qs.stringify(filterQuery, { encode: false }));
    }
  }

  /* Debounce filter for Load & Filters*/
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {

      if (hasTableLoaded) parseFilterQuery();

      setPage(0);
      setHighestFetchedPage(-1);
      await fetchEvent(true);

    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    }

  }, [activeFilters]);

  const isTableEmpty = (hasDataFetched && !isFetching) && (expectedRowCount === 0 || tableData.length === 0);

  useEffect(() => {
    setHasTableLoaded(true);
  }, []);

  const CustomTablePaginationActions = (props) => {
    return (
      <TablePaginationActions
        {...props}
        isFetching={isFetching}
      />
    );
  }

  return (
    <TableContainer component={Paper}>

      <Grid2 container>

        {/* Filters Header */}
        <DynamicSimpleFilters
          columns={columns}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />

        {/* Action Header */}
        <DynamicActionHeader
          tableName={tableName}
          fetchData={fetchData}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          defineActions={defineActions}
          quickActions={quickActions}
          setQuickActions={setQuickActions}
          quickSelectedRows={quickSelectedRows}
          setQuickSelectedRows={setQuickSelectedRows}
          activeFilters={activeFilters}
          newItemButton={newItemButton}
          showVisibleColumnsButton={showVisibleColumnsButton}
          selectedLocale={selectedLocale}
          localeStr={localeStr}
        />

      </Grid2>

      <Table sx={{ minWidth: 500 }}>
        {/* Table Body */}
        <CommonBodyCreator
          tableData={tableData}
          expectedRowCount={expectedRowCount}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          page={page}
          rowsPerPage={rowsPerPage}
          quickActions={quickActions}
          quickSelectedRows={quickSelectedRows}
          setQuickSelectedRows={setQuickSelectedRows}
          isFetching={isFetching}
          onRowClick={onRowClick}
          autoSizeHeight={autoSizeHeight}
          emptyTablePlaceholderSrc={emptyTablePlaceholderSrc}
          emptyTablePlaceholderText={emptyTablePlaceholderText}
          hasDataFetched={hasDataFetched}
        />

        {/* Table Pagination */}
        {!isTableEmpty && !hideFooter &&
          <TableFooter>
            <TableRow>
              <TablePagination
                count={expectedRowCount}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={customSelectPages ?? [5, 10]}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={localeStr ? localeStr.rowsPerPage : selectedLocale.rowsPerPage}
                labelDisplayedRows={({ from, to, count }) => {
                  return `${from} - ${to} ${localeStr ? localeStr.of : selectedLocale.of} ${count}`
                }}
                ActionsComponent={CustomTablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        }

      </Table>
    </TableContainer>
  );
}