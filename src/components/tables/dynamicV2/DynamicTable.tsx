import Grid from "@mui/material/Grid2";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import React, { useEffect, useMemo, useState } from 'react';
import { DynamicActionHeader } from './DynamicActionHeader';
import { CommonBodyCreator } from './DynamicCommons';
import { DynamicSimpleFilters } from './DynamicFilterHeader';
import { DynamicTableFooter } from './DynamicPagination';
import { localizedTableStrings } from "./DynamicTableLocale";
import { ActiveFilter, DefineActionsProps, DynColumnsDef, DynamicTableProps, QueryInfoProps } from './DynamicTypes';

export function DynamicTable<T extends Record<string, any>>(props: DynamicTableProps<T>) {

  const {
    tableInfo,
    fetchInfo,
    queryInfo = {} as QueryInfoProps,
    defineActions = {} as DefineActionsProps<T>,
    onRowClick,
    newItemButton,
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
    staticMode = false,
    emptyTablePlaceholderSrc,
    emptyTablePlaceholderText,
    showVisibleColumnsButton = true,
    paginationOptions: {
      customPageRowCount,
      customSelectPages,
      autoSizeHeight = true,
      hideFooter = false,
    },
  } = tableInfo;

  const {
    fetchData,
    isFetching,
    prefetchNextPage = true,
  } = fetchInfo;

  const { onLoadQuery, setCurrentQuery } = queryInfo;

  const currentLocale = useMemo(() => ({
    ...localizedTableStrings[tableLocale],
    ...localeStr,
  }), [tableLocale, localeStr]);

  /* Page index */
  const [currentPage, setCurrentPage] = useState<number>(0);

  /* Rows displayed per page */
  const savedRowsPerPage = useMemo(() => localStorage.getItem(`${tableName}-rowsPerPage`), [tableName]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    customPageRowCount
      ? (parseInt(savedRowsPerPage, 10) || customPageRowCount)
      : expectedRowCount
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
  const [visibleColumns, setVisibleColumns] = useState<DynColumnsDef<T>[]>([]);

  /* Quick actions */
  const [quickActions, setQuickActions] = useState<boolean>(false);
  const [quickSelectedRows, setQuickSelectedRows] = useState<T[]>([]);

  /* Has the fetch function been called */
  const [hasDataFetched, setHasDataFetched] = useState<boolean>(false);

  /* Has table loaded */
  const [hasTableLoaded, setHasTableLoaded] = useState<boolean>(false);

  /* Fetching event function */
  const fetchEvent = async (fetchType: 'first' | 'next' = 'next') => {
    if (fetchType === 'first' || highestFetchedPage < currentPage) {
      const itemsPerPage = prefetchNextPage ? rowsPerPage * 2 : rowsPerPage;
      await fetchData(itemsPerPage, activeFilters, fetchType === 'first');
      setHasDataFetched(true);

      const highestFetchedPage = prefetchNextPage ? currentPage + 1 : currentPage;
      setHighestFetchedPage(fetchType === 'first' ? 0 : highestFetchedPage);
    }
  }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
    setHighestFetchedPage(-1);
    localStorage.setItem(`${tableName}-rowsPerPage`, event.target.value);
  };

  /* Update visible columns state */
  useEffect(() => {
    if (!localVisibleCols) {
      setVisibleColumns(columns);
      return;
    }
    const parsedVisibleCols = JSON.parse(localVisibleCols) as { accessor: string, visible: boolean }[];
    setVisibleColumns(columns.map(column => {
      const localColumn = parsedVisibleCols.find(localCol => localCol.accessor === column.accessor);
      return { ...column, visible: localColumn ? localColumn.visible : column.visible ?? false };
    }));

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

  const isTableEmpty = (hasDataFetched && !isActuallyFetching) && (expectedRowCount === 0 || tableData.length === 0);

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
          onLoadQuery={onLoadQuery}
          setCurrentQuery={setCurrentQuery}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          fetchEvent={fetchEvent}
          setCurrentPage={setCurrentPage}
          setHighestFetchedPage={setHighestFetchedPage}
          hasTableLoaded={hasTableLoaded}
          localeStr={currentLocale.filters}
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
          localeStr={currentLocale.header}
        />
      </Grid>

      <Grid
        component="div"
        container
        sx={{
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          minWidth: 500,
        }}
      >
        <Table>
          {/* Table Body */}
          <CommonBodyCreator
            tableData={tableData}
            expectedRowCount={expectedRowCount}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            page={currentPage}
            rowsPerPage={rowsPerPage}
            quickActions={quickActions}
            quickSelectedRows={quickSelectedRows}
            setQuickSelectedRows={setQuickSelectedRows}
            isFetching={isActuallyFetching}
            onRowClick={onRowClick}
            autoSizeHeight={autoSizeHeight}
            emptyTablePlaceholderSrc={emptyTablePlaceholderSrc}
            emptyTablePlaceholderText={emptyTablePlaceholderText}
            hasDataFetched={hasDataFetched}
            isTableEmpty={isTableEmpty}
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
          isFetching={!isNextPageFetched && (highestFetchedPage !== currentPage)}
        />
      </Grid>

    </TableContainer>
  );
}