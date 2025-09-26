import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { DynamicColumns } from '../dynamicV2';
import {
  CommonHeaderCreator,
  DynamicCellCreator,
  getMaxWidth,
  StyledTableCell,
  variantHeightMap,
} from '../dynamicV2/DynamicCommons';

/* ---------- Common Body ---------- */

interface RealTimeBodyProps<T> {
  tableData: T[];
  expectedRowCount: number;
  visibleColumns: DynamicColumns<T>[];
  setVisibleColumns: Dispatch<SetStateAction<DynamicColumns<T>[]>>;
  quickActions: boolean;
  quickSelectedRows: T[];
  setQuickSelectedRows: Dispatch<SetStateAction<T[]>>;
  rowsPerPage: number;
  isFetching: boolean;
  onRowClick?: (row: T) => void;
  autoSizeHeight: boolean;
  emptyTablePlaceholderSrc?: string;
  emptyTablePlaceholderText?: string;
  isTableEmpty: boolean;
  hideFooter: boolean;
  variant: 'standard' | 'dense' | 'compact';
}

export function RealTimeTableBody<T extends Record<string, any>>(props: RealTimeBodyProps<T>) {
  const {
    tableData,
    visibleColumns,
    rowsPerPage,
    quickActions,
    quickSelectedRows,
    setQuickSelectedRows,
    isFetching,
    onRowClick,
    autoSizeHeight,
    emptyTablePlaceholderSrc,
    emptyTablePlaceholderText,
    isTableEmpty,
    hideFooter,
    variant,
  } = props;

  const currentPageRows = useMemo(
    () => (rowsPerPage > 0 ? tableData.slice(0, rowsPerPage) : tableData),
    [tableData, rowsPerPage],
  );

  const blankRows = !autoSizeHeight
    ? rowsPerPage - currentPageRows.length
    : 5 - currentPageRows.length || 0;

  const isQuickSelected = useCallback(
    (row: T) => {
      return quickSelectedRows.some((quickRow) => quickRow.id === row.id);
    },
    [quickSelectedRows],
  );

  const handleCheckBoxSelect = useCallback(
    (row: T) => {
      setQuickSelectedRows((prevRows) => {
        const isRowSelected = prevRows.some((quickRow) => quickRow.id === row.id);
        if (isRowSelected) {
          return prevRows.filter((quickRow) => quickRow.id !== row.id);
        }
        return [...prevRows, row];
      });
    },
    [setQuickSelectedRows],
  );

  const HeadWrapper = isTableEmpty ? 'div' : React.Fragment;

  const EmptyTable = useMemo(
    () => (
      <Grid
        component="div"
        container
        justifyContent="center"
        alignItems="center"
        minHeight={rowsPerPage * 56 + (hideFooter ? 52 : 0)}
      >
        {emptyTablePlaceholderSrc ? (
          <img
            src={emptyTablePlaceholderSrc}
            alt={emptyTablePlaceholderText || 'No Data Found'}
            loading="lazy"
            style={{
              width: 'auto',
              height: '300px',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Typography>{emptyTablePlaceholderText || 'No Data Found'}</Typography>
        )}
      </Grid>
    ),
    [emptyTablePlaceholderSrc, emptyTablePlaceholderText, hideFooter, rowsPerPage],
  );

  const SkeletonRows = useMemo(
    () =>
      Array.from({ length: rowsPerPage }, (_, index) => (
        <TableRow component="div" key={`skeleton-${index}`}>
          {visibleColumns.length > 0 ? (
            visibleColumns.map((column, colIndex) => {
              const maxWidth = getMaxWidth(column);
              if (column.visible === false) return null;
              return (
                <StyledTableCell
                  key={`skeleton-cell-${colIndex}`}
                  component="div"
                  sx={{
                    height: variantHeightMap[variant],
                    maxWidth: maxWidth,
                  }}
                >
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    height={variant === 'dense' ? undefined : 20}
                  />
                </StyledTableCell>
              );
            })
          ) : (
            <TableRow component="div" sx={{ height: variantHeightMap[variant] }}>
              <TableCell component="div" colSpan={visibleColumns.length} />
            </TableRow>
          )}
        </TableRow>
      )),
    [rowsPerPage, variant, visibleColumns],
  );

  const TableContent = useMemo(
    () => (
      <TableBody component="div">
        {isFetching
          ? SkeletonRows
          : // Table rows
            currentPageRows?.map((row, index) => {
              const randomId = Math.random().toString(36).substring(7);
              return (
                <TableRow
                  key={`table-row-${row.id || randomId}-${index}`}
                  component="div"
                  hover
                  selected={isQuickSelected(row)}
                  onClick={
                    quickActions
                      ? () => handleCheckBoxSelect(row)
                      : () => onRowClick && onRowClick(row)
                  }
                  aria-label={`table-row-${row.id || randomId}-${index}`}
                  sx={{
                    minHeight: 56,
                    '&:hover': {
                      cursor: 'pointer',
                    },
                  }}
                >
                  {quickActions && (
                    <StyledTableCell
                      key={`checkbox-${row.id || randomId}-${index}`}
                      component="div"
                      padding="checkbox"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      sx={{ height: variantHeightMap[variant] }}
                    >
                      <Checkbox
                        color="primary"
                        onChange={() => handleCheckBoxSelect(row)}
                        checked={isQuickSelected(row)}
                      />
                    </StyledTableCell>
                  )}
                  {visibleColumns.map((column, index) => {
                    if (column.visible === false) return null;

                    return (
                      <DynamicCellCreator<T>
                        key={`custom-cell-${column.accessor}-${index}`}
                        row={row}
                        column={column}
                        variant={variant}
                      />
                    );
                  })}
                </TableRow>
              );
            })}

        {/* Blank block */}
        {!isFetching && blankRows > 0 && (
          <TableRow component="div" sx={{ height: 56 * blankRows }}>
            <TableCell component="div" colSpan={visibleColumns.length} />
          </TableRow>
        )}
      </TableBody>
    ),
    [
      SkeletonRows,
      blankRows,
      currentPageRows,
      handleCheckBoxSelect,
      isFetching,
      isQuickSelected,
      onRowClick,
      quickActions,
      variant,
      visibleColumns,
    ],
  );

  return (
    <Grid
      component="div"
      container
      sx={{
        overflowX: 'auto',
        scrollbarWidth: 'thin',
        minWidth: 150,
      }}
    >
      <Table component="div">
        <HeadWrapper
          {...(isTableEmpty ? { role: 'table', style: { display: 'table', width: '100%' } } : {})}
        >
          <CommonHeaderCreator
            currentPageRows={currentPageRows}
            visibleColumns={visibleColumns}
            quickActions={quickActions}
            quickSelectedRows={quickSelectedRows}
            setQuickSelectedRows={setQuickSelectedRows}
          />
        </HeadWrapper>

        {isTableEmpty ? EmptyTable : TableContent}
      </Table>
    </Grid>
  );
}
