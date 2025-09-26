import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { ActiveFilter, DefineActionsProps, DynamicColumns } from '../dynamicV2';
import {
  CommonHeaderCreator,
  DynamicCellCreator,
  getMaxWidth,
  StyledTableCell,
  variantHeightMap,
} from '../dynamicV2/DynamicCommons';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuList from '@mui/material/MenuList';
import Divider from '@mui/material/Divider';

/* ---------- Common Body ---------- */

interface RealTimeBodyProps<T> {
  tableData: T[];
  expectedRowCount: number;
  activeFilters: ActiveFilter[];
  visibleColumns: DynamicColumns<T>[];
  setVisibleColumns: Dispatch<SetStateAction<DynamicColumns<T>[]>>;
  quickActions: boolean;
  quickSelectedRows: T[];
  defineActions: DefineActionsProps<T>;
  contextMenuActions: DefineActionsProps<T>;
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
    activeFilters,
    rowsPerPage,
    quickActions,
    quickSelectedRows,
    setQuickSelectedRows,
    defineActions,
    contextMenuActions,
    isFetching,
    onRowClick,
    autoSizeHeight,
    emptyTablePlaceholderSrc,
    emptyTablePlaceholderText,
    isTableEmpty,
    hideFooter,
    variant,
  } = props;

  const { actionList: actionHeaderList, onAction: onActionHeader } = defineActions;
  const { actionList: contextMenuActionList, onAction: onContextMenuAction } = contextMenuActions;

  const selectedContextRow = React.useRef<T | undefined>(undefined);
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = React.useCallback(
    (event: React.MouseEvent) => {
      if (quickActions) return;
      event.preventDefault();

      const rowId = (event.currentTarget as HTMLElement).getAttribute('id');
      if (rowId) {
        const row = tableData.find((r) => String(r.id) === rowId);
        selectedContextRow.current = row;
      } else {
        selectedContextRow.current = undefined;
      }

      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
            }
          : null,
      );

      // Prevent text selection lost after opening the context menu on Safari and Firefox
      const selection = document.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        setTimeout(() => {
          selection.addRange(range);
        });
      }
    },
    [contextMenu, quickActions, tableData],
  );

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
    selectedContextRow.current = undefined;
  }, []);

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

  const isContextSelected = useCallback((row: T) => {
    return selectedContextRow?.current?.id === row.id;
  }, []);

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

  const TableContent = () => (
    <TableBody component="div">
      {isFetching
        ? SkeletonRows
        : // Table rows
          currentPageRows?.map((row, index) => {
            const randomId = Math.random().toString(36).substring(7);
            return (
              <TableRow
                key={`table-row-${row.id || randomId}-${index}`}
                id={row.id}
                component="div"
                hover
                selected={isQuickSelected(row) || isContextSelected(row)}
                onClick={quickActions ? () => handleCheckBoxSelect(row) : () => onRowClick?.(row)}
                onContextMenu={handleContextMenu}
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

      <Menu
        open={contextMenu !== null && !quickActions}
        onClose={handleCloseContextMenu}
        onContextMenu={(e) => {
          e.preventDefault();
          handleCloseContextMenu();
        }}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
        }
      >
        <MenuList>
          {contextMenuActionList?.map((action, index) => (
            <MenuItem
              key={`context-header-item-${index}`}
              onClick={() => {
                if (onActionHeader && selectedContextRow?.current) {
                  onActionHeader(action.type, [selectedContextRow.current], activeFilters);
                }
                handleCloseContextMenu();
              }}
            >
              {action.icon && <ListItemIcon>{action.icon}</ListItemIcon>}
              <ListItemText>
                <Typography variant="body2" color={action.color || 'inherit'}>
                  {action.label}
                </Typography>
              </ListItemText>
            </MenuItem>
          ))}
          <Divider />
          {actionHeaderList?.map((action, index) => (
            <MenuItem
              key={`context-menu-item-${index}`}
              onClick={() => {
                if (onContextMenuAction && selectedContextRow?.current) {
                  onContextMenuAction(action.type, [selectedContextRow.current], activeFilters);
                }
                handleCloseContextMenu();
              }}
            >
              {action.icon && <ListItemIcon>{action.icon}</ListItemIcon>}
              <ListItemText>
                <Typography variant="body2" color={action.color || 'inherit'}>
                  {action.label}
                </Typography>
              </ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      {/* Blank block */}
      {!isFetching && blankRows > 0 && (
        <TableRow
          component="div"
          sx={{ height: 56 * blankRows, borderBottom: '1px solid', borderColor: 'divider' }}
        />
      )}
    </TableBody>
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

        {isTableEmpty ? EmptyTable : <TableContent />}
      </Table>
    </Grid>
  );
}
