import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Grid2 from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import { Dispatch, SetStateAction } from 'react';
import { DynColumnsDef } from './DynamicTypes';
import React from 'react';

const StyledTableRow = styled(TableRow)(({ /* theme */ }) => ({
  height: 56,
  '&:hover': {
    cursor: 'pointer',
  },
}));

/* ---------- Common header ---------- */

export interface CommonHeaderProps<T extends Record<string, any>> {
  currentPageRows: T[];
  visibleColumns: DynColumnsDef[];
  quickActions: boolean;
  quickSelectedRows: T[];
  setQuickSelectedRows: Dispatch<SetStateAction<T[]>>;
}

export function CommonHeaderCreator<T extends Record<string, any>>(props: CommonHeaderProps<T>) {

  const {
    currentPageRows,
    visibleColumns,
    quickActions,
    quickSelectedRows,
    setQuickSelectedRows
  } = props;

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setQuickSelectedRows(prevQuckRows => {
        const newRows = currentPageRows.filter(row => !prevQuckRows.some(quickRow => quickRow.id === row.id));
        return [...prevQuckRows, ...newRows];
      });
    } else {
      setQuickSelectedRows(prevQuickRows =>
        prevQuickRows.filter(quickRow => !currentPageRows.some(row => row.id === quickRow.id))
      );
    }
  }

  const allCurrentRowsSelected = currentPageRows.every(row =>
    quickSelectedRows.some(quickRow => quickRow.id === row.id
    ));

  return (
    <TableHead style={{ backgroundColor: 'rgba(224, 227, 235, 0.5)' }}>
      <TableRow>
        {quickActions &&
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              onChange={(event) => handleSelectAllClick(event)}
              checkedIcon={allCurrentRowsSelected ? <IndeterminateCheckBoxIcon /> : undefined}
              checked={allCurrentRowsSelected}
            />
          </TableCell>
        }
        {visibleColumns.map((column, index) => {

          if (column.visible === false) return null;

          return (
            <TableCell key={index} style={{ width: 160 }}>
              {column.label}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

/* ---------- Common Body ---------- */

export interface CommonBodyProps<T extends Record<string, any>> {
  tableData: T[];
  visibleColumns: DynColumnsDef[];
  setVisibleColumns: Dispatch<SetStateAction<DynColumnsDef[]>>;
  page: number;
  quickActions: boolean;
  quickSelectedRows: T[];
  setQuickSelectedRows: Dispatch<SetStateAction<T[]>>;
  rowsPerPage: number;
  isFetching: boolean;
  onRowClick?: (row: T) => void;
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
    onRowClick
  } = props;

  /* Renders cell depending on its type */
  const cellCreator = (row: T, column: DynColumnsDef, index: number) => {

    const chipColorMap = {
      warning: '#FFA500',
      success: '#40916C',
      error: '#ff0000',
      default: '#808080',
    };

    /* Extract potential nested objects values */

    const getNestedProperty = (row: T, path: string,) => {
      return path.split('.').reduce((nestedObject, property) => {
        return (nestedObject && property in nestedObject)
          ? nestedObject[property]
          : '';
      }, row).toString() ?? '';
    };

    const cellValue = getNestedProperty(row, column.accessor);

    /* Select cell data */

    const cellData = column.SelectCell?.find(cell => cell.id === cellValue);
    const customColor = cellData && cellData.type ? chipColorMap[cellData.type] : chipColorMap.default;

    switch (column.type) {

      case 'string':
        return <TableCell key={index} style={{ width: 160 }}>{cellValue}</TableCell>;

      case 'number':
        return <TableCell key={index} style={{ width: 160 }}>{cellValue}</TableCell>;

      case 'select':

        return (
          <TableCell key={index} style={{ width: 160 }}>
            <Grid2
              container
            >
              <Chip
                size="small"
                label={cellData ? cellData.label : ''}
                style={{
                  backgroundColor: `${customColor}4D`,
                  color: customColor,
                }}
              />
            </Grid2>

          </TableCell>
        );

      default:
        return <TableCell key={index} style={{ width: 160 }}>{cellValue}</TableCell>;
    }

  }

  const currentPageRows = rowsPerPage > 0
    ? tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : tableData;

  const skeletonRows = isFetching ? (rowsPerPage - currentPageRows.length) : 0;
  const blankRows = rowsPerPage - currentPageRows.length - skeletonRows;

  const isQuickSelected = (row: T) => {
    return quickSelectedRows.some(quickRow => quickRow.id === row.id);
  }

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>, row: T) => {
    setQuickSelectedRows(prevRows => {
      if (!event.target.checked) {
        return prevRows.filter(quickRow => quickRow.id !== row.id);
      }
      return [...prevRows, row];
    });
  }

  return (
    <>
      <CommonHeaderCreator
        currentPageRows={currentPageRows}
        visibleColumns={visibleColumns}
        quickActions={quickActions}
        quickSelectedRows={quickSelectedRows}
        setQuickSelectedRows={setQuickSelectedRows}
      />

      <TableBody>

        {currentPageRows.map((row) => (
          <StyledTableRow
            hover
            key={`table-row-${row.name}`}
            selected={isQuickSelected(row)}
            onClick={quickActions ? undefined : () => onRowClick && onRowClick(row)}
            aria-label={`table-row-${row.name}`}
          >
            {quickActions &&
              <TableCell
                key={`checkbox-${row.name}`}
                padding="checkbox"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <Checkbox
                  color="primary"
                  onChange={(event) => handleCheckboxClick(event, row)}
                  checked={isQuickSelected(row)}
                />
              </TableCell>
            }
            {visibleColumns.map((column, index) => {
              if (!column.visible) return null;

              return cellCreator(row, column, index);
            })}
          </StyledTableRow>
        ))}

        {/* Skeleton rows */}
        {Array.from({ length: skeletonRows }, (_, index) => (
          <TableRow key={`skeleton-${index}`} style={{ height: 56 }}>
            {visibleColumns.map((column, colIndex) => {
              if (!column.visible) return null;

              return (
                <TableCell key={`skeleton-cell-${colIndex}`} style={{ width: 180 }}>
                  <Skeleton animation="wave" />
                </TableCell>
              )
            })}
          </TableRow>
        ))}

        {/* Blank block */}
        {!isFetching && blankRows > 0 && (
          <TableRow style={{ height: 56 * blankRows }}>
            <TableCell colSpan={visibleColumns.length} />
          </TableRow>
        )}
      </TableBody>
    </>
  );
}