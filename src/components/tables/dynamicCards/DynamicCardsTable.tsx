import Table from '@mui/material/Table';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Grid from "@mui/material/Grid2";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import qs from 'qs';
import { CardsSimpleFilters } from './CardsSimpleFilters';
import { TablePaginationActions } from '../dynamicV2/DynamicPagination';
import { ActiveCardFilter, DynamicCardsProps, InfiniteViewType } from './DynamicCardsTypes';
import { CardBodyCreator } from './CardsBodyCreator';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button';

export function DynamicCardsTable<T extends Record<string, any>>(props: DynamicCardsProps<T>) {

  const {
    tableInfo: {
      tableData,
      filtersDef,
      expectedItemCount,
      tableVariant = 'standard',
      standardOptions,
      infiniteOptions,
    },
    fetchInfo: {
      fetchData,
      isFetching,
    },
    cardInfo,
    queryInfo: {
      onLoadQuery,
      setCurrentQuery
    }
  } = props;

  const {
    customPageItemCount = 5,
    customSelectPages = [5, 10, 25]
  } = standardOptions;
   
  const {
    loadingType = 'loadMore',
    gridSizings = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
    itemsPerPage = 6,
    viewType = 'cards',
  } = infiniteOptions;

  const savedView = useMemo(() => localStorage.getItem('view') as InfiniteViewType, []);
  const [selectedView, setSelectedView] = useState <InfiniteViewType | undefined>(savedView ?? viewType);

  /* Page index */
  const [page, setPage] = useState<number>(0);

  /* Rows displayed per page */
  const [rowsPerPage, setRowsPerPage] = useState<number>(customPageItemCount ?? 5);

  /* Highest fetched page */
  const [highestFetchedPage, setHighestFetchedPage] = useState<number>(-1);

  /* Active filters object */
  const [activeFilters, setActiveFilters] = useState<ActiveCardFilter[]>([]);

  /* Has loaded flag */
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  /* Fetching event function */
  const fetchEvent = useCallback(async (firstLoad: boolean = false) => {
    if (tableVariant === 'infinite') {
      if (firstLoad || tableData?.length < expectedItemCount) {
        fetchData(customPageItemCount, activeFilters, firstLoad);
      }
    } else {
      if (firstLoad || highestFetchedPage < page) {
        await fetchData(rowsPerPage, activeFilters, firstLoad);
        setHighestFetchedPage(firstLoad ? 0 : page);
      }
    }
  }, [tableVariant, tableData?.length, expectedItemCount, fetchData, customPageItemCount, activeFilters, highestFetchedPage, page, rowsPerPage]);

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

  /* Fetch event effects  */

  useEffect(() => {
    if (page !== 0) fetchEvent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (hasLoaded) fetchEvent(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage]);


  /* Debounce filter for Load & Filters*/

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {

    const parseFilterQuery = () => {
      if (setCurrentQuery) {

        const filterQuery = activeFilters.reduce((obj, filter) => {
          obj[`filter[${filter.filterName}]`] = filter.filterValue;
          return obj;
        }, {});

        setCurrentQuery(qs.stringify(filterQuery, { encode: false }));
      }
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {

      if (hasLoaded) parseFilterQuery();

      setPage(0);
      setHighestFetchedPage(-1);
      fetchEvent(true);

    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters]);

  /* Set has loaded flag */

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  /* View handler */

  const handleChageViewType = (
    event: React.MouseEvent<HTMLElement>,
    newView: InfiniteViewType | undefined,
  ) => {
    if (newView !== undefined) {
      setSelectedView(newView);
      localStorage.setItem('view', newView ?? viewType);
    }
  };


  /* Load More Pagination */

  const InfiniteFooter = useCallback(() => {

    const LoadMoreButton = () => {
      if (tableData?.length === expectedItemCount || isFetching) return null;

      return (
        <Grid
          container
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            my: 4
          }}
        >
          <Button
            variant='contained'
            color='primary'
            onClick={async () => await fetchEvent()}
          >
            {'Carica altri'}
          </Button>
        </Grid>
      );
    }

    const ScrollDetector = () => {
      const observer = useRef<IntersectionObserver | null>(null);

      const lastElementRef = useCallback((node) => {
        if (isFetching) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(async (entries) => {
          if (entries[0].isIntersecting) {
            await fetchEvent();
          }
        });
        if (node) observer.current.observe(node);
      }, []);

      return (
        <TableRow ref={lastElementRef}>
          <td colSpan={6} />
        </TableRow>
      );
    }

    return loadingType === 'loadMore' 
      ? LoadMoreButton()
      : ScrollDetector();
    
  }, [loadingType, tableData?.length, expectedItemCount, isFetching, fetchEvent]);

  const StandardTableFooter = useCallback(() => {

    const CustomTablePaginationActions = (props) => {
      return (
        <TablePaginationActions
          {...props}
          isFetching={isFetching}
        />
      );
    };

    return (
      <TableFooter>
        <TableRow>
          <TablePagination
            count={expectedItemCount}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={customSelectPages ?? [6, 12]}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={CustomTablePaginationActions}
            sx={{ 
              paddingY: '1rem !important',
              borderBottom: 'none' 
            }}
          />
        </TableRow>
      </TableFooter>
    );
  }, [expectedItemCount, rowsPerPage, customSelectPages, page, isFetching]);

  return (
    <>
      <Grid
        id='cards-table-header'
        container
        sx={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          my: 2
        }}
      >

        {/* Filters Header */}
        <CardsSimpleFilters
          filtersDef={filtersDef}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          onLoadQuery={onLoadQuery}
        />

        {/* Dual View Button */}
        {(tableData?.length > 0 && viewType === 'dual') &&
          <ToggleButtonGroup
            value={selectedView}
            exclusive
            onChange={handleChageViewType}
            aria-label="list view"
            size='small'
            sx={{ alignSelf: 'center' }}
          >
            <ToggleButton value="cards" aria-label="left aligned">
              {/* <CloseIcon size={16} /> */}
            </ToggleButton>
            <ToggleButton value="list" aria-label="centered">
              {/* <AlignJustify size={16} /> */}
            </ToggleButton>
          </ToggleButtonGroup>
        }

      </Grid>

      <Table sx={{ width: '100%', minWidth: 400 }}>

        {/* Table Body */}
        <CardBodyCreator
          tableVariant={tableVariant}
          tableData={tableData}
          cardInfo={cardInfo}
          standardOptions={{
            customPageItemCount,
            customSelectPages
          }}
          infiniteOptions={{
            loadingType,
            gridSizings,
            itemsPerPage,
            viewType: selectedView
          }}
          page={page}
          rowsPerPage={rowsPerPage}
          isFetching={isFetching}
        />

        {/* Table Pagination */}
        {tableVariant === 'infinite' 
          ? <InfiniteFooter />
          : <StandardTableFooter />
        }

      </Table>
    </>
  );
}