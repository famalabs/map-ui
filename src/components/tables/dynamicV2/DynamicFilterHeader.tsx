import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import qs from 'qs';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DateFilterForm, NumberFilterForm, SelectFilterForm, StringFilterForm, updateFilters } from './DynamicFilters';
import { ActiveFilter, CustomIconButton, DynamicColumns, i18nStrings } from './DynamicTypes';

const typeConverter = (type: string, value: any) => {
  // real typescript type conversion
  switch (type) {
    case 'string':
      return value.toString();
    case 'number':
      return Number(value);
    case 'boolean':
      return Boolean(value);
    default:
      return value;
  }
}

/* ---------- Filter Switcher ---------- */

interface FilterSwitcherProps<T> {
  column: DynamicColumns<T>;
  filterMode: 'single' | 'multiple';
  activeFilters: ActiveFilter[];
  filterIndex?: number;
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  handleClose: () => void;
  localeStr: i18nStrings['filters'];
}

function FilterSwitcher<T>(props: FilterSwitcherProps<T>) {

  const {
    column,
    filterMode,
    filterIndex,
    activeFilters,
    setActiveFilters,
    handleClose,
    localeStr
  } = props;

  switch (column.filterOptions?.type) {
    case 'string':
      return (
        <StringFilterForm
          key={column.accessor}
          column={column}
          filterMode={filterMode}
          filterIndex={filterIndex}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          closePopover={handleClose}
          localeStr={localeStr}
        />
      );
    case 'number':
      return (
        <NumberFilterForm
          key={column.accessor}
          column={column}
          filterMode={filterMode}
          filterIndex={filterIndex}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          closePopover={handleClose}
          localeStr={localeStr}
        />
      );
    case 'select':
      return (
        <SelectFilterForm
          key={column.accessor}
          column={column}
          filterMode={filterMode}
          filterIndex={filterIndex}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          closePopover={handleClose}
          localeStr={localeStr}
        />
      );

    case 'date':
      return (
        <DateFilterForm
          key={column.accessor}
          column={column}
          filterIndex={filterIndex}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          closePopover={handleClose}
          localeStr={localeStr}
        />
      );

    default:
      return null;
  }
};


/* ---------- Filter Chips ---------- */
interface FilterChip<T> {
  filterIndex: number;
  column: DynamicColumns<T>;
  activeFilters?: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  localeStr: i18nStrings['filters'];
}

export function FilterChip<T>(props: FilterChip<T>) {

  const {
    filterIndex,
    column,
    activeFilters,
    setActiveFilters,
    localeStr
  } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const handleChipClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const foundFilter = useMemo(() => activeFilters?.find(filter => filter?.filterColumn === column.accessor && filter?.filterIndex === filterIndex), [activeFilters, column.accessor, filterIndex]);
  const filterValue = useMemo(() => foundFilter?.filterValue ?? null, [foundFilter?.filterValue]);
  const selectedFilterOption = useMemo(() => column.filterOptions?.options?.find(option => option.id === filterValue), [column.filterOptions, filterValue]);

  const chipLabel = useMemo(() => {
    switch (column.filterOptions?.type) {
      case 'select':
        return selectedFilterOption?.label;
      case 'date': {
        if (foundFilter?.filterComparator === 'dateMin' || foundFilter?.filterComparator === 'dateMax') {
          const dateMin = activeFilters?.find(filter => filter?.filterColumn === column.accessor && filter?.filterComparator === 'dateMin');
          const dateMax = activeFilters?.find(filter => filter?.filterColumn === column.accessor && filter?.filterComparator === 'dateMax');
          return `${dateMin ? new Date(dateMin?.filterValue as string).toLocaleDateString() : ''} - ${dateMax ? new Date(dateMax?.filterValue as string).toLocaleDateString() : ''}`;
        }
        return new Date(filterValue as string ?? '').toLocaleDateString();
      }
      default:
        return filterValue as string ?? '';
    }
  }, [column.filterOptions?.type, column.accessor, selectedFilterOption?.label, filterValue, foundFilter?.filterComparator, activeFilters]);


  const clearFilter = useCallback((e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    updateFilters(undefined, filterIndex, '', column, setActiveFilters);
    handleClose();
  }, [filterIndex, column, setActiveFilters]);

  return (
    <Grid>
      <Chip
        clickable
        skipFocusWhenDisabled
        variant='outlined'
        size='medium'
        onClick={handleChipClick}
        icon={filterValue !== null
          ? (
            <Tooltip title={localeStr?.removeFilter} arrow>
              <HighlightOffIcon
                fontSize='small'
                color='action'
                onClick={clearFilter}
              />
            </Tooltip>
          )
          : (
            <Tooltip title={localeStr?.addFilter} arrow>
              <AddCircleOutlineIcon fontSize='small' color='action' />
            </Tooltip>
          )
        }
        onDelete={filterValue !== null ? handleChipClick : undefined}
        deleteIcon={<KeyboardArrowDownIcon fontSize='small' />}
        label={
          <Grid
            container
            justifyContent='space-between'
            alignItems='center'
            flexWrap='nowrap'
            gap={1}
          >
            <Grid>
              <Typography
                variant='body2'
                fontWeight='light'
              >
                {column.label}
              </Typography>
            </Grid>

            {filterValue !== null && (
              <>
                <Divider orientation='vertical' flexItem />

                <Grid>
                  <Typography
                    variant='body2'
                    color='primary'
                  >
                    {chipLabel}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        }
        sx={{
          borderStyle: filterValue !== null ? 'solid' : 'dashed',
          borderColor: filterValue !== null ? 'primary.main' : 'text.info',
          minWidth: '80px',
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            variant: 'outlined',
          }
        }}
      >
        <Grid
          container
          size={12}
          p={2}
          gap={1}
          maxWidth={300}
        >

          <Grid size={12}>
            <Typography
              variant='subtitle2'
              color='textSecondary'
              fontWeight='bold'
            >
              {`${localeStr?.filterBy} ${column.label}`}
            </Typography>
          </Grid>

          <Grid size={12}>
            <FilterSwitcher
              column={column}
              filterMode='single'
              filterIndex={filterIndex}
              activeFilters={activeFilters ?? []}
              setActiveFilters={setActiveFilters}
              handleClose={handleClose}
              localeStr={localeStr}
            />
          </Grid>

        </Grid>
      </Popover>
    </Grid>
  );
}

interface MoreFiltersChipProps<T> {
  columns: DynamicColumns<T>[];
  filterMode: 'single' | 'multiple';
  activeFilters: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  localeStr: i18nStrings['filters'];
}

export function MoreFiltersChip<T>(props: MoreFiltersChipProps<T>) {

  const { columns, filterMode, activeFilters, setActiveFilters, localeStr } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const handleChipClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const [selectedColumn, setSelectedColumn] = useState<DynamicColumns<T> | null>(null);
  const handleColumnSelect = (column: DynamicColumns<T>) => {
    setSelectedColumn(column);
  }

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedColumn(null);
  }

  return (
    <Grid>
      <Chip
        clickable
        skipFocusWhenDisabled
        variant='outlined'
        size='medium'
        onClick={handleChipClick}
        icon={
          <Tooltip title={localeStr?.addFilter} arrow>
            <AddCircleOutlineIcon fontSize='small' color='action' />
          </Tooltip>
        }
        label={
          <Typography
            variant='body2'
            fontWeight='light'
          >
            {localeStr?.moreFilters}
          </Typography>
        }
        deleteIcon={<KeyboardArrowDownIcon fontSize='small' />}
        sx={{
          minWidth: '80px',
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            variant: 'outlined',
          }
        }}
      >
        <Grid
          container
          size={12}
          gap={1}
          maxWidth={300}
        >

          {!selectedColumn ? (
            <List dense sx={{ width: 200 }}>
              {columns.map(column => {
                return (
                  <ListItemButton
                    key={column.accessor}
                    alignItems='center'
                    onClick={() => handleColumnSelect(column)}
                  >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <AddCircleOutlineIcon fontSize='small' color='action' />
                    </ListItemIcon>
                    <ListItemText>
                      {column.label}
                    </ListItemText>
                  </ListItemButton>
                );
              })}
            </List>
          ) : (
            <Grid
              container
              size={12}
              gap={1}
              p={2}
            >
              <Grid
                container
                size={12}
                justifyContent='flex-start'
                alignItems='center'
                gap={1}
              >

                <Grid>
                  <IconButton
                    size='small'
                    onClick={() => setSelectedColumn(null)}
                  >
                    <KeyboardArrowLeftIcon fontSize='small' />
                  </IconButton>
                </Grid>

                <Grid>
                  <Typography
                    variant='subtitle2'
                    color='textSecondary'
                    fontWeight='bold'
                  >
                    {`Filter by ${selectedColumn?.label}`}
                  </Typography>
                </Grid>
              </Grid>

              <Grid size={12}>
                <FilterSwitcher
                  column={selectedColumn}
                  filterMode={filterMode}
                  activeFilters={activeFilters}
                  setActiveFilters={setActiveFilters}
                  handleClose={handleClose}
                  localeStr={localeStr}
                />
              </Grid>
            </Grid>
          )}

        </Grid>
      </Popover>
    </Grid>
  );
}


/* ---------- Main Component ---------- */

const comparatorMap: Record<string, string | string[]> = {
  '$gte': ['dateMin', 'dateFrom'],
  '$lte': ['dateMax', 'dateTo'],
  '$gt': 'dateFrom',
  '$lt': 'dateTo',
  '$eq': 'exact',
  'gte': ['dateMin', 'dateFrom'],
  'lte': ['dateMax', 'dateTo'],
  'gt': 'dateFrom',
  'lt': 'dateTo',
  'eq': 'exact',
};

interface ChipItems<T> extends DynamicColumns<T> {
  filterIndex?: number;
}

export interface DynamicSimpleFiltersProps<T> {
  columns: DynamicColumns<T>[];
  filterMode?: 'single' | 'multiple';
  defaultShowFilters?: boolean;
  onLoadQuery?: ActiveFilter[] | string;
  setCurrentQuery?: Dispatch<React.SetStateAction<string>>;
  activeFilters: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  fetchEvent: (fetchType?: "first" | "next") => Promise<void>;
  setCurrentPage?: Dispatch<SetStateAction<number>>;
  setHighestFetchedPage?: Dispatch<SetStateAction<number>>;
  hasTableLoaded: boolean;
  setAreFiltersLoaded?: Dispatch<SetStateAction<boolean>>;
  refreshButton?: CustomIconButton;
  showRefreshButton: boolean;
  skipQueryUpdate?: boolean;
  localeStr: i18nStrings['filters'];
}

export function DynamicSimpleFilters<T>(props: DynamicSimpleFiltersProps<T>) {

  const {
    columns,
    filterMode = 'multiple',
    defaultShowFilters,
    onLoadQuery,
    setCurrentQuery,
    activeFilters,
    setActiveFilters,
    fetchEvent,
    setCurrentPage,
    setHighestFetchedPage,
    hasTableLoaded,
    setAreFiltersLoaded,
    refreshButton,
    showRefreshButton,
    skipQueryUpdate = false,
    localeStr
  } = props;

  const isFilterActive = useMemo(() => {
    return (column: DynamicColumns<T>) => activeFilters.some(filter =>
      filter?.filterColumn === column.accessor
      && filter?.filterType === column.filterOptions?.type
    );
  }, [activeFilters]);

  const filterableColumns = useMemo(() => columns.filter(column => column.filterOptions && typeof column.filterOptions === 'object'), [columns]);
  const priorityFilterColumns = useMemo(() => filterableColumns.filter(column => column.filterOptions?.priority || isFilterActive(column)), [filterableColumns, isFilterActive]);

  // visible columns that have filters
  const visibleFilterColumns = useMemo(() => {
    return priorityFilterColumns.length > 0
      ? priorityFilterColumns
      : filterableColumns;
  }, [filterableColumns, priorityFilterColumns]);

  const [visibleChips, setVisibleChips] = useState<ChipItems<T>[]>([]);

  useEffect(() => {
    if (filterMode === 'single') {
      setVisibleChips([]);
      return;
    }
    if (activeFilters.length === 0) {
      setVisibleChips([]);
      return;
    }
    const activeFilterChips = activeFilters
      .map(filter => {
        const matchingColumn = visibleFilterColumns?.find(
          column => column.accessor === filter?.filterColumn
            && column.filterOptions?.type === filter?.filterType
        );

        // skips dateMax filter since the provided dateMin filter is enough to avoid duplicates
        if (filter?.filterType === 'date' && filter?.filterComparator === 'dateMax') return undefined;

        const updatedColumn = {
          ...matchingColumn,
          filterIndex: filter?.filterIndex,
        } as ChipItems<T>;

        return matchingColumn && filter?.filterIndex ? updatedColumn : undefined;
      })
      .filter(filter => filter);

    setVisibleChips(activeFilterChips as ChipItems<T>[]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, columns, filterMode]);

  // columns in the more filters chip
  const moreFilterColumns = useMemo(() => {
    const visibleMoreColumns = visibleFilterColumns.length !== filterableColumns.length
      ? filterableColumns.filter(column => !column.filterOptions?.priority && !isFilterActive(column))
      : [];

    return filterMode === 'single' ? visibleMoreColumns : filterableColumns;
  }, [filterMode, filterableColumns, isFilterActive, visibleFilterColumns]);

  // single text filter for the search bar
  const singleTextFilter = useMemo(() =>
    filterableColumns.length === 1
      ? filterableColumns.find(column => column.filterOptions?.type === 'string')
      : undefined
    , [filterableColumns]);

  const clearAllFilters = useCallback(() => {
    if (activeFilters.length > 0) setActiveFilters([]);
    setVisibleChips(visibleFilterColumns);
  }, [activeFilters, setActiveFilters, visibleFilterColumns]);


  /* Load filters from querystring */
  useEffect(() => {
    if (!onLoadQuery) return;
    if (typeof onLoadQuery === 'string') {
      const parsedObject = qs.parse(onLoadQuery, { ignoreQueryPrefix: true });
      const filterQuery = parsedObject.filter as Record<string, any> ?? {} as Record<string, any>;

      const filterTypeIndexMap: Record<string, number> = {};

      const updatedActiveFilters = Object.entries(filterQuery).map(([filterColumn, filterValue]) => {
        const selectColumn = columns.find(column => column.filterOptions && column.accessor === filterColumn);
        const filterType = selectColumn?.filterOptions?.type;

        if (!filterType) return [];

        if (!filterTypeIndexMap[filterType]) {
          filterTypeIndexMap[filterType] = 0;
        }

        // Only increment filter index if we already have a filter with this column
        const existingFilterCount = activeFilters.filter(f => f?.filterColumn === filterColumn).length;
        const filterIndex = existingFilterCount > 0 ? filterTypeIndexMap[filterType]++ : filterTypeIndexMap[filterType];

        switch (filterType) {
          case 'string':
            return {
              filterColumn,
              filterValue,
              filterIndex,
              filterType: 'string'
            } as ActiveFilter;
          case 'number':
            return {
              filterColumn,
              filterValue: Number(filterValue),
              filterIndex,
              filterType: 'number'
            } as ActiveFilter;
          case 'select':
            {
              if (Array.isArray(filterValue)) {
                return filterValue.map((value: string, selectIndex) => ({
                  filterColumn,
                  filterValue: typeConverter(typeof selectColumn.filterOptions?.options?.[0]?.id, value),
                  filterIndex: filterIndex + selectIndex,
                  filterType: 'select'
                }));
              } else {
                return {
                  filterColumn,
                  filterValue: typeConverter(typeof selectColumn.filterOptions?.options?.[0]?.id, filterValue),
                  filterIndex,
                  filterType: 'select'
                } as ActiveFilter;
              }
            }
          case 'date': {
            if (typeof filterValue === 'object') {
              return Object.entries(filterValue).map(([dateComparator, dateValue]) => ({
                filterColumn,
                filterValue: typeConverter(typeof selectColumn.filterOptions?.options?.[0]?.id, dateValue),
                filterIndex: filterIndex,
                filterType: 'date',
                filterComparator: comparatorMap[dateComparator]?.[Object.keys(filterValue)?.length > 1 ? 0 : 1] ?? 'exact',
              } as ActiveFilter));
            } else {
              return {
                filterColumn,
                filterValue: typeConverter(typeof selectColumn.filterOptions?.options?.[0]?.id, filterValue),
                filterIndex,
                filterType: 'date',
                filterComparator: 'exact',
              } as ActiveFilter;
            }
          }
          default:
            return {
              filterColumn,
              filterValue,
              filterIndex,
            } as ActiveFilter;
        }
      })
        .flat()
        .filter(filter => filter?.filterValue !== undefined || filter?.filterValue !== null);

      setActiveFilters(updatedActiveFilters as ActiveFilter[]);
    } else {
      setActiveFilters(onLoadQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Parse filter query */
  const parseFilterQuery = useCallback(() => {
    if (!setCurrentQuery) return;
    const filterQuery = activeFilters.reduce((obj: Record<string, any>, filter) => {
      obj[`filter[${filter?.filterColumn}]`] = filter?.filterValue;
      return obj;
    }, {});
    setCurrentQuery(qs.stringify(filterQuery, { encode: false }));
    // console.log('Query updated: ', qs.stringify(filterQuery, { encode: false }));
  }, [activeFilters, setCurrentQuery]);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (hasTableLoaded && !skipQueryUpdate) parseFilterQuery();
      setCurrentPage?.(0);
      setHighestFetchedPage?.(-1);
      setAreFiltersLoaded?.(true);
      await fetchEvent('first');
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters]);

  const handleRefetchTable = useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setCurrentPage?.(0);
    setHighestFetchedPage?.(-1);
    if (!onLoadQuery) {
      setActiveFilters([]);
    } else {
      await fetchEvent('first');
    }
    refreshButton?.buttonClick?.(e);
  }, [fetchEvent, onLoadQuery, refreshButton, setActiveFilters, setCurrentPage, setHighestFetchedPage]);

  const [showFilters, setShowFilters] = useState<boolean>(defaultShowFilters !== undefined ? defaultShowFilters : true);
  const handleToggleFilters = () => setShowFilters(prev => !prev);

  return (
    <Grid
      component='div'
      container
      justifyContent="flex-start"
      alignItems="center"
      flexGrow={1}
      spacing={1}
      p={1}
    >

      {showFilters && (
        singleTextFilter ? (
          <Grid
            container
            justifyContent='flex-start'
            alignItems='center'
            flexGrow={1}
            padding={1}
          >
            <StringFilterForm
              column={singleTextFilter}
              filterMode={filterMode}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
              aloneFilter
              localeStr={localeStr}
            />
          </Grid>
        ) : (
          <Grid
            container
            justifyContent='flex-start'
            alignItems='center'
            flexGrow={1}
          >

            {visibleFilterColumns.map(column => (
              <FilterChip
                key={column.accessor}
                filterIndex={0}
                column={column}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                localeStr={localeStr}
              />
            ))}

            {visibleChips.map(column => (
              <FilterChip
                key={`${column.accessor}-${column.filterIndex}`}
                filterIndex={column.filterIndex ?? 0}
                column={column}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                localeStr={localeStr}
              />
            ))}

            {moreFilterColumns.length > 0 && (
              <MoreFiltersChip
                columns={moreFilterColumns}
                filterMode={filterMode}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                localeStr={localeStr}
              />
            )}

            {activeFilters.length > 0 &&
              <Grid>
                <Chip
                  clickable
                  label={
                    <Typography
                      variant='body2'
                      fontWeight='light'
                    >
                      {localeStr?.clear}
                    </Typography>
                  }
                  variant='outlined'
                  size='small'
                  color='primary'
                  onClick={clearAllFilters}
                  sx={{ borderStyle: 'none' }}
                />
              </Grid>
            }

            {showRefreshButton &&
              <Grid>
                <Tooltip title={refreshButton?.label ?? localeStr?.refresh} arrow>
                  <IconButton
                    size='medium'
                    color='primary'
                    onClick={handleRefetchTable}
                  >
                    {refreshButton?.icon ?? <RefreshIcon />}
                  </IconButton>
                </Tooltip>
              </Grid>
            }

          </Grid>
        )
      )}

      {!showFilters && (
        <Grid flexGrow={1}>
          <span />
        </Grid>
      )}

      {defaultShowFilters !== undefined &&
        <Grid>
          <IconButton
            size='medium'
            color='primary'
            onClick={handleToggleFilters}
          >
            {showFilters
              ? <FilterAltOutlinedIcon />
              : <FilterAltOffOutlinedIcon />
            }
          </IconButton>
        </Grid>
      }

    </Grid >
  );
}