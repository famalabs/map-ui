import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { i18nStrings } from '../dynamicV2';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';

export interface RealtimeTablePaginationActionsProps {
  unfetchedCount: { nextCount: number, prevCount: number };
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
    <Box
      component='div'
      sx={{ flexShrink: 0, ml: 2, mr: 1 }}
    >
      {unfetchedCount.nextCount === 0 && unfetchedCount.prevCount === 0 ? (
        <span />
      ) : (
        <>
            <IconButton
              onClick={handleGoLeft}
              disabled={unfetchedCount.prevCount <= 0 || isFetching}
              aria-label="previous-page"
            >
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>

            <IconButton
              onClick={handleGoRight}
              disabled={unfetchedCount.nextCount <= 0 || isFetching}
              aria-label="next-page"
            >
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
        </>
      )}

    </Box>
  );
}

interface RealTimeTableFooterProps {
  unfetchedCount: { nextCount: number, prevCount: number };
  handleDataFetch: (direction?: 'left' | 'right') => Promise<void>;
  isFetching: boolean;
  isTableEmpty: boolean;
  hideFooter: boolean;
  expectedRowCount: number;
  rowsPerPage: number;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  customSelectPages?: number[];
  localeStr: i18nStrings["footer"]
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
    footerVariant,
    handleDataFetch,
    isFetching,
    unfetchedCount,
  } = props;

  if (isTableEmpty && hideFooter) return null;

  const CustomTablePaginationActions: React.ElementType<RealtimeTablePaginationActionsProps> = () => {
    return (
      <TablePaginationActions
        handleDataFetch={handleDataFetch}
        unfetchedCount={unfetchedCount}
        isFetching={isFetching}
      />
    );
  }

  const rowsPerPageOptions = footerVariant === 'standard' ? (customSelectPages ?? [5, 10]) : [];
  const labelRowsPerPage = footerVariant === 'standard' ? localeStr?.rowsPerPage : '';
  const labelDisplayedRows = ({ count }: { count: number }) => {
    return `${count} ${localeStr?.elements}`
  }

  return (
    <Grid
      component="div"
      size={12}
      container
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <TableRow component='div'>
        <TablePagination
          component='div'
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
      </TableRow>
    </Grid>
  );

}