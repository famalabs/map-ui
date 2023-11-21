/* tslint:disable */
import {
  TableOptions,
  usePagination,
  useRowSelect,
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
} from 'react-table';
import React from 'react';
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import TableContainer from "@mui/material/TableContainer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import FormControlLabel from "@mui/material/FormControlLabel";



import {
  CommonTable,
  CommonTablePagination,
  HideColumns,
  TableFilters,
  commonTableProps,
  getQueryFromState,
  TableSelect,
  GlobalFilter,
  TableFilter,
} from './common';
import { ITablePaginatedProps, selectRowsColumnId } from './utils';

export type StaticTablePaginatedProps<T extends Record<string, any>> = ITablePaginatedProps<T>;

export function StaticTablePaginated<T extends Record<string, any>>(props: StaticTablePaginatedProps<T>) {
  const {
    tableProps: tableGivenProps,
    loading,
    paginationOptions,
    hideColumnAction,
    onSingleRowClick,
    router,
    setSelected,
  } = props;
  const container = props.container ?? Paper;

  const tableProps: any = React.useMemo(() => commonTableProps(tableGivenProps), [
    tableGivenProps,
  ]);
  //React.useMemo(() => console.log('givenprops update'), [tableGivenProps]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    preFilteredRows,
    allColumns,
    visibleColumns,
    selectedFlatRows,

    gotoPage,
    setPageSize,
    pageCount,
    getToggleAllRowsSelectedProps,
    setFilter,
    setAllFilters,
    toggleAllRowsSelected,
    setGlobalFilter,
    state: { pageIndex, pageSize, filters, sortBy, globalFilter },
  }:any = useTable<any>(
    tableProps,
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.allColumns.push((columns) => [
        {
          id: String(selectRowsColumnId),
          Header: ({ getToggleAllPageRowsSelectedProps }:any) => (
            <Checkbox {...getToggleAllPageRowsSelectedProps()} />
          ),
          Cell: ({ row }:any) => <Checkbox {...row.getToggleRowSelectedProps()} />,
        },
        ...columns,
      ]);
    }
  );

  React.useEffect(() => {
    if (router) router.setQuery(getQueryFromState({ filters, sortBy }));
  }, [filters, sortBy, router]);

  React.useEffect(() => {
    if (setSelected) setSelected(selectedFlatRows.map((r) => r.original));
  }, [selectedFlatRows]);
  //React.useEffect(() => console.log('setSelected chaged'), [setSelected]);
  //React.useEffect(() => console.log('selectedRowIds chaged'), [selectedRowIds]);
  //React.useEffect(() => console.log('change selectedFlatRows'), [selectedFlatRows]);

  const isSelectRowVisible = React.useMemo(
    () => !!visibleColumns.find(({ id }) => id === selectRowsColumnId),
    [visibleColumns]
  );

  // filters state utilities
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filterColumn, setFilterColumn] = React.useState<string | undefined>(undefined);

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        <TableSelect
          allColumns={allColumns}
          deselectRows={() => (selectedFlatRows.length > 0 ? toggleAllRowsSelected(false) : null)}
        />
        <TableFilter
          allColumns={allColumns}
          filters={filters}
          setFilter={setFilter}
          setAllFilters={setAllFilters}
          panelOpen={filterOpen}
          setPanelOpen={setFilterOpen}
          defaultColumn={filterColumn}
          setDefaultColumn={setFilterColumn}
        />
        <HideColumns allColumns={allColumns} hideColumnAction={hideColumnAction} />
        {filters.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <b>{rows.length}</b> element{rows.length === 1 ? 'o' : 'i'} trovat{rows.length === 1 ? 'o' : 'i'}{' '}
            su {preFilteredRows.length}
          </div>
        )}
      </div>
      <TableContainer>
        <CommonTable
          onFilterClick={(id) => {
            setFilterColumn(id);
            setFilterOpen(true);
          }}
          {...{
            pageSize,
            onSingleRowClick,
            visibleColumns,
            headerGroups,
            getTableProps,
            getTableBodyProps,
            prepareRow,
            page,
            loading,
          }}
        />
        <Box display="flex" p={1} >
          <Box p={1} flexGrow={1} >
            {isSelectRowVisible && (
              <Toolbar style={{ alignItems: 'center', minHeight: '52px' }}>
                <FormControlLabel
                  control={<Checkbox {...getToggleAllRowsSelectedProps()} />}
                  label="Seleziona tutti"
                />
                <Box component="span">
                  Selezionati: {selectedFlatRows.length} / {rows.length}
                </Box>
              </Toolbar>
            )}
          </Box>
          <Box p={1} >
            <CommonTablePagination
              totalRows={rows.length}
              pageIndex={pageIndex}
              pageSize={pageSize}
              rowsPerPageOptions={paginationOptions.pageSizes}
              pageCount={pageCount}
              gotoPage={gotoPage}
              setPageSize={setPageSize}
              changeSizeEvent={paginationOptions.changeSize}
            />
          </Box>
        </Box>
      </TableContainer>
    </>
  );
}
