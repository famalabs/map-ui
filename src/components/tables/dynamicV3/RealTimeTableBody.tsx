import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { SquareCheckIcon, SquareIcon } from 'lucide-react';
import React from 'react';
import { ActiveFilter, DefineActionsProps, DynamicColumns } from '../dynamicV2';
import {
  CommonHeaderCreator,
  DynamicCellCreator,
  getMaxWidth,
  StyledTableCell,
  variantHeightMap,
} from '../dynamicV2/DynamicCommons';

interface RealTimeBodyProps<T> {
  tableData: T[];
  expectedRowCount: number;
  activeFilters: ActiveFilter[];
  visibleColumns: DynamicColumns<T>[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<DynamicColumns<T>[]>>;
  quickActions: boolean;
  quickSelectedRows: T[];
  defineActions: DefineActionsProps<T>;
  contextMenuActions: DefineActionsProps<T>;
  setQuickSelectedRows: React.Dispatch<React.SetStateAction<T[]>>;
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

  const { actionList: actionHeaderList = [], onAction: onActionHeader } = defineActions;
  const { actionList: contextMenuActionList = [], onAction: onContextMenuAction } =
    contextMenuActions;

  const [selectedContextRow, setSelectedContextRow] = React.useState<T | undefined>(undefined);
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = React.useCallback(
    (event: React.MouseEvent) => {
      if (quickActions) return;
      if (actionHeaderList.length === 0 && contextMenuActionList.length === 0) return;

      event.preventDefault();

      const rowId = (event.currentTarget as HTMLElement).getAttribute('id');
      if (rowId) {
        const row = tableData.find((r) => String(r.id) === rowId);
        setSelectedContextRow(row);
      } else {
        setSelectedContextRow(undefined);
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
    [actionHeaderList.length, contextMenu, contextMenuActionList.length, quickActions, tableData],
  );

  const handleCloseContextMenu = React.useCallback(() => {
    setContextMenu(null);
    setSelectedContextRow(undefined);
  }, []);

  const currentPageRows = React.useMemo(
    () => (rowsPerPage > 0 ? tableData.slice(0, rowsPerPage) : tableData),
    [tableData, rowsPerPage],
  );

  const blankRows = !autoSizeHeight
    ? rowsPerPage - currentPageRows.length
    : 5 - currentPageRows.length || 0;

  const isQuickSelected = React.useCallback(
    (row: T) => {
      return quickSelectedRows.some((quickRow) => quickRow.id === row.id);
    },
    [quickSelectedRows],
  );

  const isContextSelected = React.useCallback(
    (row: T) => {
      return selectedContextRow?.id === row.id;
    },
    [selectedContextRow],
  );

  const handleCheckBoxSelect = React.useCallback(
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

  const EmptyTable = (
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
  );

  const SkeletonRows = React.useMemo(
    () =>
      Array.from({ length: rowsPerPage }, (_, index) => (
        <TableRow component="div" key={`skeleton-${index}`}>
          {quickActions && (
            <StyledTableCell
              key={`skeleton-checkbox-${index}`}
              component="div"
              padding="checkbox"
              sx={{ height: variantHeightMap[variant], width: 56 }}
            >
              <Skeleton
                animation="wave"
                variant="rounded"
                height={variant === 'dense' ? undefined : 20}
              />
            </StyledTableCell>
          )}

          {visibleColumns.length > 0 ? (
            visibleColumns.map((column) => {
              const maxWidth = getMaxWidth(column);
              if (column.visible === false) return null;
              return (
                <StyledTableCell
                  key={`skeleton-cell-${column.accessor}`}
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
            <StyledTableCell
              component="div"
              colSpan={quickActions ? 1 : 0}
              sx={{ height: variantHeightMap[variant] }}
            />
          )}
        </TableRow>
      )),
    [rowsPerPage, variant, visibleColumns, quickActions],
  );

  const DataRows = React.useMemo(
    () =>
      currentPageRows?.map((row, index) => (
        <TableRow
          key={`table-row-${row.id}-${index}`}
          id={row.id}
          component="div"
          hover
          selected={isQuickSelected(row) || isContextSelected(row)}
          onClick={quickActions ? () => handleCheckBoxSelect(row) : () => onRowClick?.(row)}
          onContextMenu={handleContextMenu}
          aria-label={`table-row-${row.id}-${index}`}
          sx={{
            minHeight: 56,
            transition: 'background-color 0.1s ease',
            '&:hover': {
              cursor: 'pointer',
              transition: 'background-color 0s ease',
            },
          }}
        >
          {quickActions && (
            <StyledTableCell
              key={`checkbox-${row.id}-${index}`}
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
                icon={<SquareIcon size={22} />}
                checkedIcon={<SquareCheckIcon size={22} />}
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
      )),
    [
      currentPageRows,
      handleCheckBoxSelect,
      handleContextMenu,
      isContextSelected,
      isQuickSelected,
      onRowClick,
      quickActions,
      variant,
      visibleColumns,
    ],
  );

  const ContextMenu = React.useMemo(
    () => (
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
        <MenuList
          sx={{
            minWidth: 100,
            maxWidth: 240,
            p: 0,
            outline: 'none',
            '& .MuiMenuItem-root': {
              gap: 0.5,
            },
            '& .MuiListItemText-root': {
              overflow: 'hidden',
              maxWidth: '100%',
            },
            '& .MuiListItemText-root .MuiTypography-root': {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
              maxWidth: '100%',
            },
          }}
        >
          {contextMenuActionList?.map((action, index) => (
            <MenuItem
              key={`context-header-item-${index}`}
              onClick={() => {
                if (onContextMenuAction && selectedContextRow) {
                  onContextMenuAction(action.type, [selectedContextRow], activeFilters);
                }
                handleCloseContextMenu();
              }}
            >
              {action.icon && (
                <ListItemIcon>
                  <IconButton
                    color={action.color || 'inherit'}
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    sx={{ p: 0 }}
                  >
                    {action.icon}
                  </IconButton>
                </ListItemIcon>
              )}
              <ListItemText>
                <Typography
                  variant="body2"
                  color={action.color || 'inherit'}
                  noWrap
                  title={action.label}
                >
                  {action.label}
                </Typography>
              </ListItemText>
            </MenuItem>
          ))}

          {contextMenuActionList.length > 0 && actionHeaderList.length > 0 && <Divider />}

          {actionHeaderList?.map((action, index) => (
            <MenuItem
              key={`context-menu-item-${index}`}
              onClick={() => {
                if (onActionHeader && selectedContextRow) {
                  onActionHeader(action.type, [selectedContextRow], activeFilters);
                }
                handleCloseContextMenu();
              }}
            >
              {action.icon && (
                <ListItemIcon>
                  <IconButton
                    color={action.color || 'inherit'}
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    sx={{ p: 0 }}
                  >
                    {action.icon}
                  </IconButton>
                </ListItemIcon>
              )}

              <ListItemText>
                <Typography
                  variant="body2"
                  color={action.color || 'inherit'}
                  noWrap
                  title={action.label}
                >
                  {action.label}
                </Typography>
              </ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    ),
    [
      actionHeaderList,
      activeFilters,
      contextMenu,
      contextMenuActionList,
      handleCloseContextMenu,
      onActionHeader,
      onContextMenuAction,
      quickActions,
      selectedContextRow,
    ],
  );

  const TableContent = (
    <TableBody component="div">
      {isFetching ? SkeletonRows : DataRows}
      {ContextMenu}
      {!isFetching && blankRows > 0 && (
        <TableRow
          component="div"
          sx={{ height: 56 * blankRows, borderBottom: '1px solid', borderColor: 'divider' }}
        />
      )}
    </TableBody>
  );

  return (
    <Table
      component="div"
      sx={{
        overflowX: 'auto',
        minWidth: 150,
      }}
    >
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
  );
}
