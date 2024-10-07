/* tslint:disable */
import {
  usePagination,
  useRowSelect,
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  TableInstance,
  ActionType,
} from "react-table";
import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TableContainer from "@mui/material/TableContainer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import FormControlLabel from "@mui/material/FormControlLabel";

import {
  CommonTable,
  CommonTablePagination,
  HideColumns,
  commonTableProps,
  getQueryFromState,
  TableSelect,
  GlobalFilter,
  TableFilter,
  getStateFromQuery,
} from "./common";
import { ITablePaginatedProps, selectRowsColumnId, itLocale, enLocale } from "./utils";
import { Button, IconButton, Stack, TableProps, Tooltip } from "@mui/material";

export type StaticTablePaginatedProps<T extends Record<string, any>> = ITablePaginatedProps<T>;

export function StaticTablePaginated<T extends Record<string, any>>(
  props: StaticTablePaginatedProps<T>
) {
  const {
    tableProps: tableGivenProps,
    actionList,
    loading,
    paginationOptions,
    hideColumnAction,
    onSingleRowClick,
    onAction,
    router,
    setSelected,
    customPageIndex,
    onPageChange,
    defaultLocale,
    alternateLocale,
  } = props;
  //const container = props.container ?? Paper;

  const [currentLocale, setCurrentLocale] = useState<Record<string, any>>(itLocale);

  React.useMemo(() => {

    if (!alternateLocale || Object.keys(alternateLocale).length === 0) {

      switch (defaultLocale) {
        case 'it':
          setCurrentLocale(itLocale);
          break;
        case 'en':
          setCurrentLocale(enLocale);
          break;
        default:
          setCurrentLocale(itLocale);
          break;
      }
    } else setCurrentLocale(alternateLocale);

  }, [defaultLocale, alternateLocale]);


  const tableProps: any = React.useMemo(() => commonTableProps(tableGivenProps), [tableGivenProps]);
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
    setSortBy,
    state: { pageIndex, pageSize, filters, sortBy, globalFilter },
  }: TableProps<any> = useTable<TableInstance>(
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
          Header: ({ getToggleAllPageRowsSelectedProps }: any) => (
            <Checkbox {...getToggleAllPageRowsSelectedProps()} />
          ),
          Cell: ({ row }: any) => <Checkbox {...row.getToggleRowSelectedProps()} />,
        },
        ...columns,
      ]);
    }
  );

  // Set initial filters and sort on load
  

  /* React.useEffect(() => {

    const testParams = new URLSearchParams('filter[name]=not-contains,2&filter[name]=not-equals,3&filter[qty]=less-than-equals,1&sort=available&order=desc&page=2');
    const testEntries = testParams.entries();
    
    const { filters, sortBy, pageIndex } = getStateFromQuery(testEntries);

    setAllFilters(filters);
    setSortBy(sortBy);
    gotoPage(pageIndex);


  }, []); */

  // Run setQuery function each time filters, sortBy or pageIndex changes
  /* React.useEffect(() => {
    const queryString = getQueryFromState({ filters, sortBy, pageIndex });
    if (router) router.setQuery(queryString);

    console.log('QueryToSetApp: ', queryString);

  }, [filters, sortBy, router, pageIndex]); */

  React.useMemo(() => {
    if (setSelected) setSelected(selectedFlatRows.map((row) => row.original));
  }, [selectedFlatRows]);

  const isSelectRowVisible = React.useMemo(
    () => !!visibleColumns.find(({ id }) => id === selectRowsColumnId),
    [visibleColumns]
  );

  // filters state utilities
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filterColumn, setFilterColumn] = React.useState<string | undefined>(undefined);

  // run onPageChange function each time pageIndex changes
  React.useEffect(() => {
    if (onPageChange) onPageChange(pageIndex);
  }, [pageIndex]);

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <GlobalFilter
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          gotoPage={gotoPage}
          localeObj={currentLocale.globalfilter}
        />
        <TableSelect
          allColumns={allColumns}
          deselectRows={() => (selectedFlatRows.length > 0 ? toggleAllRowsSelected(false) : null)}
          localeObj={currentLocale.quickactions}
        />
        <TableFilter
          allColumns={allColumns}
          filters={filters}
          setFilter={setFilter}
          setAllFilters={setAllFilters}
          gotoPage={gotoPage}
          panelOpen={filterOpen}
          setPanelOpen={setFilterOpen}
          defaultColumn={filterColumn}
          setDefaultColumn={setFilterColumn}
          localeObj={currentLocale.dynfilter}
        />
        <HideColumns allColumns={allColumns} hideColumnAction={hideColumnAction} />
        {filters.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <b>{rows.length}</b> {currentLocale.dynfilter['found']} {currentLocale.pagination['of']} {preFilteredRows.length}
          </div>
        )}
      </div>

      {selectedFlatRows.length > 0 && (
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          alignItems="center"
          sx={{ margin: "1rem" }}
        >
          <Box component="span">
            {currentLocale.quickactions['selected']}: {selectedFlatRows.length} / {rows.length}
          </Box>

          {/** Need a empty space between box and the buttons */}
          <Box component="span" width="1rem" />

          <Box component="span">
            {actionList.map((action) =>
              action.onlyIcon && !!action.text ? (
                <Tooltip title={action.text}>
                  <IconButton
                    size="medium"
                    key={action.type}
                    onClick={() => onAction(action.type, selectedFlatRows)}
                  >
                    {action.icon}
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  variant="contained"
                  startIcon={action.icon}
                  key={action.type}
                  onClick={() => onAction(action.type, selectedFlatRows)}
                >
                  {" "} {action.text}{" "}
                </Button>
              )
            )}
          </Box>
        </Stack>
      )}

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
        <Box display="flex" p={1}>
          <Box p={1} flexGrow={1}>
            {isSelectRowVisible && (
              <Toolbar style={{ alignItems: "center", minHeight: "52px" }}>
                <FormControlLabel
                  control={<Checkbox {...getToggleAllRowsSelectedProps()} />}
                  label={currentLocale.quickactions["selectall"]}
                />
              </Toolbar>
            )}
          </Box>
          <Box p={1}>
            <CommonTablePagination
              totalRows={rows.length}
              pageIndex={pageIndex}
              pageSize={pageSize}
              rowsPerPageOptions={paginationOptions.pageSizes}
              pageCount={pageCount}
              gotoPage={gotoPage}
              setPageSize={setPageSize}
              changeSizeEvent={paginationOptions.changeSize}
              localeObj={currentLocale.pagination}
            />
          </Box>
        </Box>
      </TableContainer>
    </>
  );
}
