import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import TablePagination from '@mui/material/TablePagination';
import React from 'react';
import { i18nStrings } from '../dynamicV2';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export interface RealtimeTablePaginationActionsProps {
  unfetchedCount: { nextCount: number; prevCount: number };
  handleDataFetch: (direction?: 'left' | 'right') => Promise<void>;
  isFetching: boolean;
}

export function TablePaginationActions(props: RealtimeTablePaginationActionsProps) {
  const { unfetchedCount, handleDataFetch, isFetching } = props;

  const theme = useTheme();

  const handleGoLeft = async () => {
    await handleDataFetch('left');
  };

  const handleGoRight = async () => {
    await handleDataFetch('right');
  };

  return (
    <Box component="div" sx={{ flexShrink: 0, ml: 2, mr: 1 }}>
      {unfetchedCount.nextCount === 0 && unfetchedCount.prevCount === 0 ? (
        <span />
      ) : (
        <>
          <IconButton
            onClick={handleGoLeft}
            disabled={unfetchedCount.prevCount <= 0 || isFetching}
            aria-label="previous-page"
          >
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon size={20} />
            ) : (
              <ChevronLeftIcon size={20} />
            )}
          </IconButton>

          <IconButton
            onClick={handleGoRight}
            disabled={unfetchedCount.nextCount <= 0 || isFetching}
            aria-label="next-page"
          >
            {theme.direction === 'rtl' ? (
              <ChevronLeftIcon size={20} />
            ) : (
              <ChevronRightIcon size={20} />
            )}
          </IconButton>
        </>
      )}
    </Box>
  );
}

interface RealTimeTableFooterProps {
  unfetchedCount: { nextCount: number; prevCount: number };
  handleDataFetch: (direction?: 'left' | 'right') => Promise<void>;
  isFetching: boolean;
  isTableEmpty: boolean;
  hideFooter: boolean;
  stickyFooter: boolean;
  expectedRowCount: number;
  rowsPerPage: number;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  customSelectPages?: number[];
  localeStr: i18nStrings['footer'];
  footerVariant?: 'standard' | 'simple';
}

export const RealTimeTableFooter = (props: RealTimeTableFooterProps) => {
  const {
    expectedRowCount,
    rowsPerPage,
    handleChangeRowsPerPage,
    customSelectPages,
    localeStr,
    isTableEmpty,
    hideFooter,
    stickyFooter,
    footerVariant,
    handleDataFetch,
    isFetching,
    unfetchedCount,
  } = props;

  if (isTableEmpty && hideFooter) return null;

  const CustomTablePaginationActions: React.ElementType<
    RealtimeTablePaginationActionsProps
  > = () => {
    return (
      <TablePaginationActions
        handleDataFetch={handleDataFetch}
        unfetchedCount={unfetchedCount}
        isFetching={isFetching}
      />
    );
  };

  const rowsPerPageOptions = footerVariant === 'standard' ? customSelectPages ?? [5, 10] : [];
  const labelRowsPerPage = footerVariant === 'standard' ? localeStr?.rowsPerPage : '';
  const labelDisplayedRows = ({ count }: { count: number }) => {
    return `${count} ${localeStr?.elements}`;
  };

  return (
    <Grid
      className="RealTimeTable-Footer"
      component="div"
      size={12}
      container
      data-sticky
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: '0 0 8px 8px',
        position: stickyFooter ? 'sticky' : 'static',
        bottom: 0,
        backgroundColor: 'background.paper',
        zIndex: 1,
      }}
    >
      <TablePagination
        component="div"
        count={expectedRowCount}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        page={0}
        onPageChange={() => null}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={labelRowsPerPage}
        labelDisplayedRows={labelDisplayedRows}
        ActionsComponent={CustomTablePaginationActions as any}
        sx={{
          border: 'none',
        }}
      />
    </Grid>
  );
};
