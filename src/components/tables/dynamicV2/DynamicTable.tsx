import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DynamicActionHeader } from './DynamicActionHeader';
import { CommonBodyCreator } from './DynamicCommons';
import { DynamicSimpleFilters } from './DynamicFilterHeader';
import { DynamicTableFooter } from './DynamicPagination';
import { localizedTableStrings } from './DynamicTableLocale';
import {
  ActiveFilter,
  DefineActionsProps,
  DynamicColumns,
  DynamicTableProps,
  QueryInfoProps,
} from './DynamicTypes';

function LoadCurrentColumns<T>({
  columns,
  localVisibleCols,
  setCurrentColumns,
}: {
  columns: DynamicColumns<T>[];
  localVisibleCols: string | null;
  setCurrentColumns: (columns: DynamicColumns<T>[]) => void;
}) {
  if (!localVisibleCols) {
    setCurrentColumns(columns);
    return;
  }
  const parsedVisibleCols = JSON.parse(localVisibleCols) as {
    accessor: string;
    visible: boolean;
  }[];
  setCurrentColumns(
    columns
      .map((column) => {
        const localColumn = parsedVisibleCols.find(
          (localCol) => localCol.accessor === column.accessor,
        );
        return {
          ...column,
          visible: localColumn ? localColumn?.visible : column?.visible ?? true,
          locked: Boolean(column.locked),
        };
      })
      // sort them like the order of localVisibleCols
      .sort((a, b) => {
        const aIndex = parsedVisibleCols.findIndex((col) => col.accessor === a.accessor);
        const bIndex = parsedVisibleCols.findIndex((col) => col.accessor === b.accessor);
        return aIndex - bIndex;
      }),
  );
}

export function DynamicTable<T extends Record<string, any>>(props: DynamicTableProps<T>) {
  const {
    tableInfo,
    fetchInfo,
    queryInfo = {} as QueryInfoProps,
    defineActions = {} as DefineActionsProps<T>,
    onRowClick,
    newItemButton,
    columnsButton,
    actionButton,
    exportButton,
    refreshButton,
    paperVariant = 'outlined',
    tableLocale = 'en',
    localeStr,
  } = props;

  const {
    tableName,
    tableData,
    columns,
    expectedRowCount,
    variant = 'standard',
    filterMode = 'single',
    defaultShowFilters,
    staticMode = false,
    showRefreshButton = true,
    emptyTablePlaceholderSrc,
    emptyTablePlaceholderText,
    showVisibleColumnsButton = true,
  } = tableInfo;

  const { fetchData, isFetching, prefetchNextPage = true } = fetchInfo;

  const {
    customPageRowCount,
    customSelectPages,
    autoSizeHeight = true,
    hideFooter = false,
    footerVariant = 'standard',
  } = tableInfo.paginationOptions || {};

  const { filtersQuery } = queryInfo;

  const currentLocale = useMemo(
    () => ({
      ...localizedTableStrings[tableLocale],
      ...localeStr,
    }),
    [tableLocale, localeStr],
  );

  /* Page index */
  const [currentPage, setCurrentPage] = useState<number>(0);

  /* Rows displayed per page */
  const savedRowsPerPage = useMemo(
    () => localStorage.getItem(`${tableName}-rowsPerPage`),
    [tableName],
  );
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    customPageRowCount ? parseInt(savedRowsPerPage ?? '5') || customPageRowCount : expectedRowCount,
  );

  /* Highest fetched page */
  const [highestFetchedPage, setHighestFetchedPage] = useState<number>(-1);

  /* Check for prefetched data */
  const isActuallyFetching = isFetching && tableData.length === currentPage * rowsPerPage;
  const isNextPageFetched = !staticMode ? highestFetchedPage >= currentPage : true;

  /* Active filters object */
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  /* Visible columns state (define structure later) */
  const localVisibleCols = useMemo(() => localStorage.getItem(tableName), [tableName]);
  const [currentColumns, setCurrentColumns] = useState<DynamicColumns<T>[]>([]);

  /* Quick actions */
  const [quickActions, setQuickActions] = useState<boolean>(false);
  const [quickSelectedRows, setQuickSelectedRows] = useState<T[]>([]);

  /* Has the fetch function been called */
  const [hasDataFetched, setHasDataFetched] = useState<boolean>(false);

  const [hasTableLoaded, setHasTableLoaded] = useState<boolean>(false);

  /* Fetching event function */
  const fetchEvent = useCallback(
    async (fetchType: 'first' | 'next' = 'next') => {
      // This tells how many pages to fetch
      const itemsPerPage = prefetchNextPage ? rowsPerPage * 2 : rowsPerPage;
      // This tells how many pages are being fetched at startup
      const firstFetchPages = prefetchNextPage ? 1 : 0;
      // This tells the current highest fetched page
      const currentHighestFetchedPage = prefetchNextPage ? currentPage + 1 : currentPage;

      if (fetchType === 'first' || highestFetchedPage < currentPage) {
        await fetchData(itemsPerPage, activeFilters, fetchType === 'first');
        setHasDataFetched(true);
        setHighestFetchedPage(fetchType === 'first' ? firstFetchPages : currentHighestFetchedPage);
      }
    },
    [currentPage, fetchData, activeFilters, rowsPerPage, highestFetchedPage, prefetchNextPage],
  );

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setCurrentPage(0);
      setHighestFetchedPage(-1);
      localStorage.setItem(`${tableName}-rowsPerPage`, event.target.value);
    },
    [tableName],
  );

  /* Update visible columns state */
  useEffect(() => {
    LoadCurrentColumns({ columns, localVisibleCols, setCurrentColumns });
  }, [columns, localVisibleCols]);

  /* Fetch event effects when page & rowsPerPage change  */

  useEffect(() => {
    /* Skip fetch is static mode is enabled */
    if (currentPage !== 0 && !staticMode) fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    /* Skip fetch is static mode is enabled */
    if (hasTableLoaded && !staticMode) fetchEvent('first');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage]);

  const isTableEmpty =
    hasDataFetched && !isActuallyFetching && (expectedRowCount === 0 || tableData.length === 0);

  useEffect(() => {
    setHasTableLoaded(true);
  }, []);

  return (
    <TableContainer
      component={Paper}
      variant={paperVariant}
      sx={{ overflowX: 'hidden', tableLayout: 'fixed', width: '100%' }}
    >
      <Grid container>
        {/* Filters Header */}
        <DynamicSimpleFilters
          columns={columns}
          filterMode={filterMode}
          defaultShowFilters={defaultShowFilters}
          filtersQuery={filtersQuery}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          fetchEvent={fetchEvent}
          setCurrentPage={setCurrentPage}
          setHighestFetchedPage={setHighestFetchedPage}
          refreshButton={refreshButton}
          showRefreshButton={showRefreshButton}
          localeStr={currentLocale.filters}
        />

        {/* Action Header */}
        <DynamicActionHeader
          tableName={tableName}
          tableData={tableData}
          currentColumns={currentColumns}
          setCurrentColumns={setCurrentColumns}
          isFetching={isActuallyFetching}
          defineActions={defineActions}
          quickActions={quickActions}
          setQuickActions={setQuickActions}
          quickSelectedRows={quickSelectedRows}
          setQuickSelectedRows={setQuickSelectedRows}
          activeFilters={activeFilters}
          newItemButton={newItemButton}
          columnsButton={columnsButton}
          actionButton={actionButton}
          exportButton={exportButton}
          showVisibleColumnsButton={showVisibleColumnsButton}
          localeStr={currentLocale.header}
        />
      </Grid>

      <Grid
        container
        sx={{
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          minWidth: 150,
        }}
      >
        <Table component="div">
          {/* Table Body */}
          <CommonBodyCreator
            tableData={tableData}
            expectedRowCount={expectedRowCount}
            visibleColumns={currentColumns}
            setVisibleColumns={setCurrentColumns}
            page={currentPage}
            rowsPerPage={rowsPerPage}
            quickActions={quickActions}
            quickSelectedRows={quickSelectedRows}
            setQuickSelectedRows={setQuickSelectedRows}
            isFetching={isActuallyFetching || !hasDataFetched}
            onRowClick={onRowClick}
            autoSizeHeight={autoSizeHeight}
            emptyTablePlaceholderSrc={emptyTablePlaceholderSrc}
            emptyTablePlaceholderText={emptyTablePlaceholderText}
            hasDataFetched={hasDataFetched}
            isTableEmpty={isTableEmpty}
            hideFooter={hideFooter}
            variant={variant}
          />
        </Table>
      </Grid>

      {/* Table Pagination */}
      <Grid
        component="div"
        container
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <DynamicTableFooter
          expectedRowCount={expectedRowCount}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          customSelectPages={customSelectPages}
          localeStr={currentLocale.footer}
          isTableEmpty={isTableEmpty}
          hideFooter={hideFooter}
          isFetching={!isNextPageFetched}
          footerVariant={footerVariant}
        />
      </Grid>
    </TableContainer>
  );
}
