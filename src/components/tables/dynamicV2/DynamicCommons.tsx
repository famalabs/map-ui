import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { DynamicColumns } from './DynamicTypes';
import Table from '@mui/material/Table';

export const StyledTableCell = styled(TableCell)(() => ({
  height: 56,
  maxWidth: 180,
  padding: '0px 16px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}));

export const variantHeightMap = {
  standard: 56,
  dense: 48,
  compact: 40,
};

export const getMaxWidth = (column: DynamicColumns<any>) => {
  switch (typeof column.maxWidth) {
    case 'number':
      return `${column.maxWidth}px`;
    case 'string': {
      if (column.maxWidth === 'stretch') {
        return '100%';
      }
      if (column.maxWidth.endsWith('px')) {
        return column.maxWidth as string;
      }
      break;
    }
    default:
      return '180px';
  }
};

/* ---------- Dynamic Cell Creator ---------- */

export interface DynamicCellProps<T> {
  row: T;
  column: DynamicColumns<T>;
  variant?: 'standard' | 'dense' | 'compact';
}

export function DynamicCellCreator<T extends Record<string, any>>(props: DynamicCellProps<T>) {
  const { row, column, variant = 'standard' } = props;

  /* Extract potential nested objects values */
  const getNestedProperty = useCallback((row: T, path: string): string => {
    return (
      path.split('.').reduce((nestedObject: any, property) => {
        return nestedObject && property in nestedObject ? (nestedObject[property] as string) : '';
      }, row) ?? ''
    );
  }, []);

  const maxWidth = getMaxWidth(column);

  const cellValue = getNestedProperty(row, column.accessor);

  const CustomCell = 'Cell' in column && column.Cell !== undefined ? column.Cell : undefined;

  return (
    <StyledTableCell component="div" sx={{ height: variantHeightMap[variant], maxWidth: maxWidth }}>
      {CustomCell ? (
        <CustomCell cellValue={cellValue} currentColumn={column} currentRow={row} />
      ) : (
        <span>{cellValue}</span>
      )}
    </StyledTableCell>
  );
}

/* ---------- Common header ---------- */

export interface CommonHeaderProps<T extends Record<string, any>> {
  currentPageRows: T[];
  visibleColumns: DynamicColumns<T>[];
  quickActions: boolean;
  quickSelectedRows: T[];
  setQuickSelectedRows: Dispatch<SetStateAction<T[]>>;
}

export function CommonHeaderCreator<T extends Record<string, any>>(props: CommonHeaderProps<T>) {
  const { currentPageRows, visibleColumns, quickActions, quickSelectedRows, setQuickSelectedRows } =
    props;

  const [hoveredColumn, setHoveredColumn] = React.useState<number>(-1);
  const handleHoveredColumn = useCallback(
    (column: DynamicColumns<T>, index: number) =>
      (event: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
        event.stopPropagation();
        if (!('Tooltip' in column)) {
          return;
        }
        setHoveredColumn(index);
      },
    [],
  );

  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setQuickSelectedRows((prevQuckRows) => {
          const newRows = currentPageRows.filter(
            (row) => !prevQuckRows.some((quickRow) => quickRow.id === row.id),
          );
          return [...prevQuckRows, ...newRows];
        });
      } else {
        setQuickSelectedRows((prevQuickRows) =>
          prevQuickRows.filter(
            (quickRow) => !currentPageRows.some((row) => row.id === quickRow.id),
          ),
        );
      }
    },
    [currentPageRows, setQuickSelectedRows],
  );

  const allCurrentRowsSelected = useMemo(
    () =>
      currentPageRows.every((row) => quickSelectedRows.some((quickRow) => quickRow.id === row.id)),
    [currentPageRows, quickSelectedRows],
  );

  return (
    <TableHead component="div" style={{ backgroundColor: 'rgba(224, 227, 235, 0.5)' }}>
      <TableRow component="div">
        {quickActions && (
          <StyledTableCell component="div" padding="checkbox">
            <Checkbox
              color="primary"
              onChange={(event) => handleSelectAllClick(event)}
              checkedIcon={allCurrentRowsSelected ? <IndeterminateCheckBoxIcon /> : undefined}
              checked={allCurrentRowsSelected}
            />
          </StyledTableCell>
        )}
        {visibleColumns.length > 0 ? (
          visibleColumns.map((column, index) => {
            const maxWidth = getMaxWidth(column);
            if (column.visible === false) return null;
            return (
              <StyledTableCell
                key={index}
                component="div"
                onMouseEnter={handleHoveredColumn(column, index)}
                onMouseLeave={handleHoveredColumn(column, -1)}
                sx={{
                  width: 160,
                  position: 'relative',
                  maxWidth: maxWidth,
                }}
              >
                {column.ColumnCell ? column.ColumnCell() : column.label || ''}
                {'Tooltip' in column && hoveredColumn === index && (
                  <Tooltip title={column.Tooltip?.label || ''}>
                    <IconButton
                      disableRipple
                      color={column.Tooltip?.color || 'default'}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      {column.Tooltip?.icon || <InfoOutlined fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                )}
              </StyledTableCell>
            );
          })
        ) : (
          <StyledTableCell component="div" sx={{ width: 160, position: 'relative' }} />
        )}
      </TableRow>
    </TableHead>
  );
}

/* ---------- Common Body ---------- */

export interface CommonBodyProps<T extends Record<string, any>> {
  tableData: T[];
  expectedRowCount: number;
  visibleColumns: DynamicColumns<T>[];
  setVisibleColumns: Dispatch<SetStateAction<DynamicColumns<T>[]>>;
  page: number;
  quickActions: boolean;
  quickSelectedRows: T[];
  setQuickSelectedRows: Dispatch<SetStateAction<T[]>>;
  rowsPerPage: number;
  isFetching: boolean;
  onRowClick?: (row: T) => void;
  autoSizeHeight: boolean;
  emptyTablePlaceholderSrc?: string;
  emptyTablePlaceholderText?: string;
  hasDataFetched: boolean;
  isTableEmpty: boolean;
  hideFooter: boolean;
  variant: 'standard' | 'dense' | 'compact';
}

export function CommonBodyCreator<T extends Record<string, any>>(props: CommonBodyProps<T>) {
  const {
    tableData,
    visibleColumns,
    page,
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
    () =>
      rowsPerPage > 0
        ? tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : tableData,
    [tableData, page, rowsPerPage],
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
