import Table from '@mui/material/Table';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useEffect, useRef, useState } from 'react';
import qs from 'qs';
import { CardsSimpleFilters } from './CardsSimpleFilters';
import { TablePaginationActions } from '../dynamicV2';
import { ActiveCardFilter, DynamicCardsProps } from './DynamicCardsTypes';
import { CardBodyCreator } from './CardsBodyCreator';

export function DynamicCardsTable<T extends Record<string, any>>(props: DynamicCardsProps<T>) {

  const {
    tableInfo: {
      tableData,
      filtersDef,
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
    cardInfo,
    queryInfo: {
      onLoadQuery,
      setCurrentQuery
    }
  } = props;

  /* Page index */
  const [page, setPage] = useState<number>(0);

  /* Rows displayed per page */
  const [rowsPerPage, setRowsPerPage] = useState<number>(customPageRowCount ?? 5);

  /* Highest fetched page */
  const [highestFetchedPage, setHighestFetchedPage] = useState<number>(-1);

  /* Active filters object */
  const [activeFilters, setActiveFilters] = useState<ActiveCardFilter[]>([]);

  /* Has loaded flag */
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

  /* Load filters from querystring */

  useEffect(() => {
    if (onLoadQuery) {
      const parsedObject = qs.parse(onLoadQuery, { ignoreQueryPrefix: true });
      const filterQuery = parsedObject.filter as Record<string, any>;

      const updatedActiveFilters = Object.entries(filterQuery).map(([filterName, filterValue]) => {

        const selectColumn = filtersDef.find(column => column.type === 'select' && column.accessor === filterName);

        switch (typeof selectColumn?.SelectCell?.[0].id) {
          case 'string':
            return { filterName, filterValue } as ActiveCardFilter;
          case 'number':
            return { filterName, filterValue: Number(filterValue) } as ActiveCardFilter;
          case 'boolean':
            return { filterName, filterValue: JSON.parse(filterValue.toLowerCase()) } as ActiveCardFilter;
          default:
            return { filterName, filterValue } as ActiveCardFilter;
        }

      });

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
        obj[`filter[${filter.filterName}]`] = filter.filterValue;
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

  /* Set has loaded flag */

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  /* Custom Table Pagination Actions */

  const CustomTablePaginationActions = (props) => {
    return (
      <TablePaginationActions
        {...props}
        isFetching={isFetching}
      />
    );
  }

  return (
    <>

      <Grid2 container>

        {/* Filters Header */}
        <CardsSimpleFilters
          filtersDef={filtersDef}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />

      </Grid2>

      <Table sx={{ minWidth: 500 }}>

        {/* Table Body */}
        <CardBodyCreator
          tableData={tableData}
          cardInfo={cardInfo}
          page={page}
          rowsPerPage={rowsPerPage}
          isFetching={isFetching}
        />

        {/* Table Pagination */}
        <TableFooter>
          <TableRow>
            <TablePagination
              count={expectedRowCount}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={customSelectPages ?? [6, 12]}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={CustomTablePaginationActions}
            />
          </TableRow>
        </TableFooter>

      </Table>
    </>
  );
}