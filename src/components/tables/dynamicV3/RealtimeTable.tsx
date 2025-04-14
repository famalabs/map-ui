import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActiveFilter, DefineActionsProps, DynamicColumns, QueryInfoProps } from '../dynamicV2';
import { DynamicActionHeader } from '../dynamicV2/DynamicActionHeader';
import { DynamicSimpleFilters } from '../dynamicV2/DynamicFilterHeader';
import { localizedTableStrings } from '../dynamicV2/DynamicTableLocale';
import { RealTimeTableBody } from './RealTimeTableBody';
import { RealTimeTableFooter } from './RealTimeTableFooter';
import { RealtimeTableProps } from './RealtimeTableTypes';

export function LoadSavedColumns<T>(
  columns: DynamicColumns<T>[],
  savedVisibleColumns: Array<string> | undefined,
  setCurrentColumns: (columns: DynamicColumns<T>[]) => void,
) {
  if (!savedVisibleColumns || savedVisibleColumns.length === 0) {
    setCurrentColumns(columns);
    return;
  }
  
  setCurrentColumns(columns
    .map(column => {
      const localColumn = savedVisibleColumns.find(savedColumn => savedColumn === column.accessor);
      return {
        ...column,
        visible: Boolean(localColumn) ?? Boolean(column.visible),
        locked: Boolean(column.locked),
      };
    })
    // sort them like the order of localVisibleCols
    .sort((a, b) => {
      const aIndex = savedVisibleColumns.findIndex(col => col === a.accessor);
      const bIndex = savedVisibleColumns.findIndex(col => col === b.accessor);
      return aIndex - bIndex;
    })
  );
}

export function RealtimeTable<T extends Record<string, any>>(props: RealtimeTableProps<T>) {

  const {
    tableInfo,
    fetchInfo,
    queryInfo = {} as QueryInfoProps,
    defineActions = {} as DefineActionsProps<T>,
    onRowClick,
    onRowsPerPageChange,
    onColumnsPopoverClose,
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
    savedVisibleColumns,
    expectedRowCount,
    variant = 'standard',
    filterMode = 'single',
    defaultShowFilters,
    showRefreshButton = true,
    emptyTablePlaceholderSrc,
    emptyTablePlaceholderText,
    showVisibleColumnsButton = true,
  } = tableInfo;

  const {
    customPageRowCount,
    customSelectPages,
    autoSizeHeight = true,
    hideFooter = false,
    footerVariant = 'standard',
  } = tableInfo.paginationOptions || {};

  const {
    fetchData,
    isFetching,
  } = fetchInfo;

  const { onLoadQuery, setCurrentQuery } = queryInfo;

  const currentLocale = useMemo(() => ({
    ...localizedTableStrings[tableLocale],
    ...localeStr,
  }), [tableLocale, localeStr]);

  const [hasTableLoaded, setHasTableLoaded] = useState<boolean>(false);
  const [areFiltersLoaded, setAreFiltersLoaded] = useState<boolean>(false);

  /* Rows displayed per page */
  const [rowsPerPage, setRowsPerPage] = useState<number>(Number(customPageRowCount) ?? Number(expectedRowCount));

  const handleChangeRowsPerPage = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newRowsPerPage = Number(event.target.value);
    setRowsPerPage(newRowsPerPage);
    onRowsPerPageChange?.(newRowsPerPage);
  }, [onRowsPerPageChange]);

  /* Active filters object */
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  /* Visible columns state (define structure later) */
  const [currentColumns, setCurrentColumns] = useState<DynamicColumns<T>[]>([]);

  /* Update visible columns state */
  useEffect(() => {
    LoadSavedColumns(
      columns,
      savedVisibleColumns,
      setCurrentColumns,
    );
  }, [columns, savedVisibleColumns]);

  /* Quick actions */
  const [quickActions, setQuickActions] = useState<boolean>(false);
  const [quickSelectedRows, setQuickSelectedRows] = useState<T[]>([]);

  // indicates the amount of items contained in the next page and previous page
  const [unfetchedCount, setUnfetchedCount] = useState({ nextCount: 0, prevCount: 0 });

  const handleDataFetch = useCallback(async (direction?: 'left' | 'right' | 'reset') => {
    const { nextCount, prevCount } = await fetchData(rowsPerPage, activeFilters, direction);
    setUnfetchedCount({ nextCount, prevCount });
  }, [fetchData, rowsPerPage, activeFilters]);

  useEffect(() => {
    if (hasTableLoaded && areFiltersLoaded) handleDataFetch('reset');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage]);

  const filterFetchEvent = async (fetchType?: "first" | "next") => {
    if (fetchType === "first") {
      await handleDataFetch();
    }
  }

  const isTableEmpty = (hasTableLoaded && !isFetching) && (expectedRowCount === 0 || tableData.length === 0);

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
          onLoadQuery={onLoadQuery}
          setCurrentQuery={setCurrentQuery}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          fetchEvent={filterFetchEvent}
          hasTableLoaded={hasTableLoaded}
          setAreFiltersLoaded={setAreFiltersLoaded}
          refreshButton={refreshButton}
          showRefreshButton={showRefreshButton}
          skipQueryUpdate={true}
          localeStr={currentLocale.filters}
        />

        {/* Action Header */}
        <DynamicActionHeader
          tableName={tableName}
          currentColumns={currentColumns}
          setCurrentColumns={setCurrentColumns}
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
          onColumnsPopoverClose={onColumnsPopoverClose}
          showVisibleColumnsButton={showVisibleColumnsButton}
          localeStr={currentLocale.header}
        />
      </Grid>


      {/* Table Body */}
      <RealTimeTableBody
        tableData={tableData}
        expectedRowCount={expectedRowCount}
        visibleColumns={currentColumns}
        setVisibleColumns={setCurrentColumns}
        rowsPerPage={rowsPerPage}
        quickActions={quickActions}
        quickSelectedRows={quickSelectedRows}
        setQuickSelectedRows={setQuickSelectedRows}
        isFetching={isFetching}
        onRowClick={onRowClick}
        autoSizeHeight={autoSizeHeight}
        emptyTablePlaceholderSrc={emptyTablePlaceholderSrc}
        emptyTablePlaceholderText={emptyTablePlaceholderText}
        isTableEmpty={isTableEmpty}
        hideFooter={hideFooter}
        variant={variant}
      />

      {/* Table Footer */}

      <RealTimeTableFooter
        unfetchedCount={unfetchedCount}
        handleDataFetch={handleDataFetch}
        isFetching={isFetching}
        hideFooter={hideFooter}
        isTableEmpty={isTableEmpty}
        expectedRowCount={expectedRowCount}
        rowsPerPage={rowsPerPage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        customSelectPages={customSelectPages}
        localeStr={currentLocale.footer}
        footerVariant={footerVariant}
      />

    </TableContainer>
  );
}