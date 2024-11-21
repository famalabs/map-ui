import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { i18nStrings } from './DynamicTypes';

export interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  isFetching: boolean;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

export function TablePaginationActions(props: TablePaginationActionsProps) {

  const { count, page, rowsPerPage, isFetching, onPageChange } = props;

  const theme = useTheme();

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box
      component='div'
      sx={{ flexShrink: 0, ml: 2.5 }}
    >
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous-page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>

      <IconButton
        onClick={handleNextButtonClick}
        disabled={(page >= Math.ceil(count / rowsPerPage) - 1) || isFetching}
        aria-label="next-page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>

    </Box>
  );
}

export interface TableFooterProps {
  expectedRowCount: number;
  rowsPerPage: number;
  page: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  customSelectPages?: number[];
  selectedLocale: i18nStrings;
  localeStr?: i18nStrings;
  isTableEmpty: boolean;
  hideFooter: boolean;
  isFetching: boolean;
}

export function DynamicTableFooter(props: TableFooterProps) {

  const {
    expectedRowCount,
    rowsPerPage,
    page,
    handleChangePage,
    handleChangeRowsPerPage,
    customSelectPages,
    localeStr,
    selectedLocale,
    isTableEmpty,
    hideFooter,
    isFetching,
  } = props;


  if (isTableEmpty && hideFooter) return null;

  const CustomTablePaginationActions: React.ElementType<TablePaginationActionsProps> = (props) => {
    return (
      <TablePaginationActions
        {...props}
        isFetching={isFetching}
      />
    );
  }

  return (
    <TableRow component='div'>
      <TablePagination
        component='div'
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
        ActionsComponent={CustomTablePaginationActions as any}
        sx={{
          border: 'none',
        }}
      />
    </TableRow>
  );
}
