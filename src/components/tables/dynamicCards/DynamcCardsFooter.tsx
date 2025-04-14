import React, { useCallback, useRef } from 'react';
import { TablePaginationActions, TablePaginationActionsProps } from '../dynamicV2/DynamicPagination';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

interface StandardTableFooterProps {
  expectedItemCount: number;
  rowsPerPage: number;
  customSelectPages?: number[];
  currentPage: number;
  isFetching: boolean;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const StandardTableFooter = (props: StandardTableFooterProps) => {

  const {
    expectedItemCount,
    rowsPerPage,
    customSelectPages,
    currentPage,
    isFetching,
    handleChangePage,
    handleChangeRowsPerPage
  } = props;

  const CustomTablePaginationActions = (props: TablePaginationActionsProps) => {
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
          page={currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={CustomTablePaginationActions as any}
          sx={{
            paddingY: '1rem !important',
            borderBottom: 'none'
          }}
        />
      </TableRow>
    </TableFooter>
  );
};

interface InfiniteFooterProps<T> {
  tableData: Array<T>;
  expectedItemCount: number;
  isFetching: boolean;
  hasDataFetched: boolean;
  fetchEvent: (fetchType?: "first" | "next") => Promise<void>;
  loadingType: 'infiniteScroll' | 'loadMore';
}

const InfiniteFooter = (props: InfiniteFooterProps<unknown>) => {

  const {
    tableData,
    expectedItemCount,
    isFetching,
    hasDataFetched,
    fetchEvent,
    loadingType
  } = props;

  const LoadMoreButton = () => {
    
    if ((tableData?.length >= expectedItemCount && hasDataFetched) || isFetching || !hasDataFetched) return null;

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
          onClick={async () => {
            await fetchEvent('next');
          }}
        >
          {'Carica altri'}
        </Button>
      </Grid>
    );
  }

  const ScrollDetector = () => {
    const observer = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback((node: HTMLTableRowElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting) {
          if (tableData.length === expectedItemCount) return;
          await fetchEvent('next');
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
};

interface DynamicCardsFooterProps<T> {
  tableData: Array<T>
  tableVariant: 'standard' | 'infinite';
  fetchEvent: (fetchType?: "first" | "next") => Promise<void>;
  loadingType: 'infiniteScroll' | 'loadMore';
  expectedItemCount: number;
  rowsPerPage: number;
  customSelectPages?: number[];
  currentPage: number;
  isFetching: boolean;
  hasDataFetched: boolean;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DynamicCardsFooter<T>(props: DynamicCardsFooterProps<T>) {

  const {
    tableData,
    tableVariant,
    fetchEvent,
    loadingType,
    expectedItemCount,
    rowsPerPage,
    customSelectPages,
    currentPage,
    isFetching,
    hasDataFetched,
    handleChangePage,
    handleChangeRowsPerPage
  } = props;

  if (tableVariant === 'infinite') {
    return (
      <InfiniteFooter
        tableData={tableData}
        expectedItemCount={expectedItemCount}
        isFetching={isFetching}
        hasDataFetched={hasDataFetched} 
        fetchEvent={fetchEvent}
        loadingType={loadingType}
      />
    );
  } else {
    return (
      <StandardTableFooter
        expectedItemCount={expectedItemCount}
        rowsPerPage={rowsPerPage}
        customSelectPages={customSelectPages}
        currentPage={currentPage}
        isFetching={isFetching}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    );
  }
}