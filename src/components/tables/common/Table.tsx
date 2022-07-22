/* eslint react/jsx-key: 0 */
import React from 'react';
import {
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme
} from '@mui/material';
import { ITablePaginatedProps, selectRowsColumnId } from '../utils';
import { TableInstance } from 'react-table';
import { Skeleton } from '@mui/lab';

interface IProps<T extends Record<string, any>>
  extends Pick<any, 'getTableBodyProps' | 'headerGroups' | 'getTableProps' | 'page' | 'prepareRow' | 'visibleColumns'> {
  pageSize: number;
  onSingleRowClick: ITablePaginatedProps<T>['onSingleRowClick'];
  loading: boolean;
  onFilterClick?: (id: string) => void;
}

export function FilterIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        d="M5,4 L19,4 C19.2761424,4 19.5,4.22385763 19.5,4.5 C19.5,4.60818511 19.4649111,4.71345191 19.4,4.8 L14,12 L14,20.190983 C14,20.4671254 13.7761424,20.690983 13.5,20.690983 C13.4223775,20.690983 13.3458209,20.6729105 13.2763932,20.6381966 L10,19 L10,12 L4.6,4.8 C4.43431458,4.5790861 4.4790861,4.26568542 4.7,4.1 C4.78654809,4.03508894 4.89181489,4 5,4 Z" />
    </SvgIcon>
  );
}

export function HiddenIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        d="M19.2078777,9.84836149 C20.3303823,11.0178941 21,12 21,12 C21,12 16.9090909,18 12,18 C11.6893441,18 11.3879033,17.9864845 11.0955026,17.9607365 L19.2078777,9.84836149 Z"
        fillRule="nonzero"
      />
      <path
        d="M14.5051465,6.49485351 L12,9 C10.3431458,9 9,10.3431458 9,12 L5.52661464,15.4733854 C3.75006453,13.8334911 3,12 3,12 C3,12 5.45454545,6 12,6 C12.8665422,6 13.7075911,6.18695134 14.5051465,6.49485351 Z"
        fillRule="nonzero"
      />
      <rect
        opacity="0.3"
        transform="translate(12.524621, 12.424621) rotate(-45.000000) translate(-12.524621, -12.424621) "
        x="3.02462111"
        y="11.4246212"
        width="19"
        height="2"
      />
    </SvgIcon>
  );
}

export function QuickIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        d="M16.3740377,19.9389434 L22.2226499,11.1660251 C22.4524142,10.8213786 22.3592838,10.3557266 22.0146373,10.1259623 C21.8914367,10.0438285 21.7466809,10 21.5986122,10 L17,10 L17,4.47708173 C17,4.06286817 16.6642136,3.72708173 16.25,3.72708173 C15.9992351,3.72708173 15.7650616,3.85240758 15.6259623,4.06105658 L9.7773501,12.8339749 C9.54758575,13.1786214 9.64071616,13.6442734 9.98536267,13.8740377 C10.1085633,13.9561715 10.2533191,14 10.4013878,14 L15,14 L15,19.5229183 C15,19.9371318 15.3357864,20.2729183 15.75,20.2729183 C16.0007649,20.2729183 16.2349384,20.1475924 16.3740377,19.9389434 Z" />
      <path
        d="M4.5,5 L9.5,5 C10.3284271,5 11,5.67157288 11,6.5 C11,7.32842712 10.3284271,8 9.5,8 L4.5,8 C3.67157288,8 3,7.32842712 3,6.5 C3,5.67157288 3.67157288,5 4.5,5 Z M4.5,17 L9.5,17 C10.3284271,17 11,17.6715729 11,18.5 C11,19.3284271 10.3284271,20 9.5,20 L4.5,20 C3.67157288,20 3,19.3284271 3,18.5 C3,17.6715729 3.67157288,17 4.5,17 Z M2.5,11 L6.5,11 C7.32842712,11 8,11.6715729 8,12.5 C8,13.3284271 7.32842712,14 6.5,14 L2.5,14 C1.67157288,14 1,13.3284271 1,12.5 C1,11.6715729 1.67157288,11 2.5,11 Z"
        opacity="0.3"
      />
    </SvgIcon>
  );
}

export function SearchIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        d="M14.2928932,16.7071068 C13.9023689,16.3165825 13.9023689,15.6834175 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 L19.7071068,19.2928932 C20.0976311,19.6834175 20.0976311,20.3165825 19.7071068,20.7071068 C19.3165825,21.0976311 18.6834175,21.0976311 18.2928932,20.7071068 L14.2928932,16.7071068 Z"
        fillRule="nonzero"
        opacity="0.3"
      />
      <path
        d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 C14.8659932,4 18,7.13400675 18,11 C18,14.8659932 14.8659932,18 11,18 Z"
        fillRule="nonzero"
      />
    </SvgIcon>
  );
}

export function CommonTable<T extends Record<string, any>>(props: IProps<T>) {

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    page,
    prepareRow,
    visibleColumns,
    onSingleRowClick,
    pageSize,
    loading,
    onFilterClick
  } = props;
  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column:any, index) => {
              return (
                <TableCell
                  sx={{
                    ...(index === 0 && {
                        '-webkit-position': 'sticky',
  position: 'sticky',
  //backgroundColor: theme.palette.background.paper,
  zIndex: 1,
  left: 0,
  fontWeight: '300',
  '&:hover $filterButton': {
    display: 'initial'
  }
                      }),

                    ...(index !== 0 && {
                      position: 'relative',
    '&:hover $filterButton': {
      display: 'initial'
    }
                    })
                  }}
                  padding={
                    column.canFilter ? 'normal' : column.id === selectRowsColumnId ? 'checkbox' : 'normal'
                  }
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                  {column.canFilter && onFilterClick ? (
                    <IconButton
                      onClick={() => onFilterClick(column.id)}
                      size={'small'}
                      sx={{position: 'absolute',
                      right: 0,
                      display: 'none',
                      fontSize: '0.7rem'}}
                    >
                      <FilterIcon />
                    </IconButton>
                  ) : null}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {page.map((row) => {
          prepareRow(row);
          return (
            <TableRow
              hover={true}
              sx={{
                ...(onSingleRowClick && {
                  '&.MuiTableRow-hover': {
                    cursor: 'pointer',
                  }
                })
              }}
              // !!visibleColumns.find((column) => column.id === selectRowsColumnId) || !!onSingleRowClick
              selected={row.isSelected}
              onClick={() => {
                if (visibleColumns.find((column) => column.id === selectRowsColumnId))
                  row.toggleRowSelected();
                else if (onSingleRowClick) onSingleRowClick(row);
              }}
              {...row.getRowProps()}
            >
              {row.cells.map((cell, index) => {
                return (
                  <TableCell
                    variant={'body'}
                    sx={{
                      ...(index === 0 && {
                          '-webkit-position': 'sticky',
    position: 'sticky',
    //backgroundColor: theme.palette.background.paper,
    zIndex: 1,
    left: 0,
    fontWeight: '300',
    '&:hover $filterButton': {
      display: 'initial'
    }
                        }),

                      ...(index !== 0 && {
                        fontWeight: '300'
                      })
                    }}
                    padding={
                      cell.column.canFilter
                        ? 'normal'
                        : cell.column.id === selectRowsColumnId
                        ? 'checkbox'
                        : 'normal'
                    }
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
        {page.length < pageSize &&
        (loading ? (
          Array(pageSize - page.length)
            .fill(null)
            .map((_, idx) => (
              <TableRow key={idx}>
                {visibleColumns.map((column) => (
                  <TableCell key={column.id}>
                    <Skeleton animation="wave" />
                  </TableCell>
                ))}
              </TableRow>
            ))
        ) : (
          <TableRow style={{ height: 53 * (pageSize - page.length) }}>
            <TableCell colSpan={visibleColumns.length}>
              {page.length === 0 ? 'No data found' : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
