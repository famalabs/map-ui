import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useEffect, useRef, useState } from 'react';
import qs from 'qs';
import { DynamicActionHeader } from './DynamicActionHeader';
import { CommonBodyCreator } from './DynamicCommons';
import { DynamicSimpleFilters } from './DynamicFilters';
import { TablePaginationActions } from './DynamicPagination';
import { ActiveFilter, DynColumnsDef, DynamicTableProps } from './DynamicTypes';

export function DynamicTable<T extends Record<string, any>>(props: DynamicTableProps<T>) {

  const {
    tableInfo: {
      tableName,
      tableData,
      columns,
      expectedRowCount,
      paginationOptions: {
        customPageRowCount,
        customSelectPages,
      },
    },
    fetchInfo: {
      fetchData,
      isFetching
    },
    queryInfo: {
      onLoadQuery,
      setCurrentQuery
    },
    defineActions,
    onRowClick,
    newItemButton,
  } = props;

  /* Page index */
  const [page, setPage] = useState<number>(0);

  /* Rows displayed per page */
  const [rowsPerPage, setRowsPerPage] = useState<number>(customPageRowCount ?? 5);

  /* Highest fetched page */
  const [highestFetchedPage, setHighestFetchedPage] = useState<number>(-1);

  /* Active filters object */
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  
  /* Visible columns state (define structure later) */
  const [visibleColumns, setVisibleColumns] = useState<DynColumnsDef[]>([]);

  /* Quick actions */
  const [quickActions, setQuickActions] = useState<boolean>(false);
  const [quickSelectedRows, setQuickSelectedRows] = useState<T[]>([]);

  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  /* Fetching event function */
  const fetchEvent = (firstLoad: boolean = false) => {
    if (firstLoad || highestFetchedPage < page) {
      fetchData(rowsPerPage, activeFilters, firstLoad);
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
    setPage(0);
    setHighestFetchedPage(-1);
  };

  /* Update visible columns state */
  useEffect(() => {

    const localVisibleCols = localStorage.getItem(tableName);

    if (localVisibleCols) {

      const parsedVisibleCols = JSON.parse(localVisibleCols) as { accessor: string, visible: boolean }[];

      setVisibleColumns(columns.map(column => {
        const localColumn = parsedVisibleCols.find(localCol => localCol.accessor === column.accessor);
        return { ...column, visible: localColumn ? localColumn.visible : column.visible };
      }));

    } else setVisibleColumns(columns);

  }, [columns]);


  /* Load filters from querystring */
  useEffect(() => {
    if (onLoadQuery) {
      const parsedObject = qs.parse(onLoadQuery, { ignoreQueryPrefix: true });
      const filterQuery = parsedObject.filter as Record<string, any> ?? {} as Record<string, any>;

      const updatedActiveFilters = Object.entries(filterQuery).map(([filterColumn, filterValue]) => {

        const selectColumn = columns.find(column => column.type === 'select' && column.accessor === filterColumn);

        switch (typeof selectColumn?.SelectCell?.[0].id) {
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

      //console.log('Filter Value: ', updatedActiveFilters);

      setActiveFilters(updatedActiveFilters);
    }
  }, []);

  /* Fetch event effects  */

  useEffect(() => {
    (page !== 0) && fetchEvent();
  }, [page]);

  useEffect(() => {
    hasLoaded && fetchEvent(true);
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

    debounceTimeoutRef.current = setTimeout(() => {

      hasLoaded && parseFilterQuery();

      setPage(0);
      setHighestFetchedPage(-1);
      fetchEvent(true);

    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    }

  }, [activeFilters]);

  useEffect(() => {
    setHasLoaded(true);
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
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          defineActions={defineActions}
          quickActions={quickActions}
          setQuickActions={setQuickActions}
          quickSelectedRows={quickSelectedRows}
          setQuickSelectedRows={setQuickSelectedRows}
          newItemButton={newItemButton}
        />

      </Grid2>

      <Table sx={{ minWidth: 500 }}>

        {/* Table Body */}
        <CommonBodyCreator
          tableData={tableData}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          page={page}
          rowsPerPage={rowsPerPage}
          quickActions={quickActions}
          quickSelectedRows={quickSelectedRows}
          setQuickSelectedRows={setQuickSelectedRows}
          isFetching={isFetching}
          onRowClick={onRowClick}
        />

        {/* Table Pagination */}
        <TableFooter>
          <TableRow>
            <TablePagination
              count={expectedRowCount}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={customSelectPages ?? [5, 10]}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={CustomTablePaginationActions}
            />
          </TableRow>
        </TableFooter>

      </Table>
    </TableContainer>
  );
}