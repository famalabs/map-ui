import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import qs from 'qs';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DateFilterForm,
  NumberFilterForm,
  SelectFilterForm,
  StringFilterForm,
  updateFilters,
} from './DynamicFilters';
import { ActiveFilter, CustomIconButton, DynamicColumns, i18nStrings } from './DynamicTypes';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  FunnelIcon,
  FunnelXIcon,
  PlusCircleIcon,
  RotateCwIcon,
  XCircleIcon,
} from 'lucide-react';
import { useTheme } from '@mui/material';

const serializeFilters = (filters: ActiveFilter[]) =>
  filters
    .map((filter) => ({
      index: filter.filterIndex ?? 0,
      column: filter.filterColumn ?? '',
      comparator: filter.filterComparator ?? '',
      type: filter.filterType ?? '',
      value:
        filter.filterValue === undefined || filter.filterValue === null
          ? ''
          : typeof filter.filterValue === 'object'
          ? JSON.stringify(filter.filterValue)
          : String(filter.filterValue),
    }))
    .sort((a, b) => {
      if (a.column !== b.column) return a.column.localeCompare(b.column);
      if (a.index !== b.index) return a.index - b.index;
      if (a.comparator !== b.comparator) return a.comparator.localeCompare(b.comparator);
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return a.value.localeCompare(b.value);
    })
    .map((item) => `${item.type}|${item.column}|${item.index}|${item.comparator}|${item.value}`)
    .join('-');

const typeConverter = (id: string | number | boolean | undefined, value: unknown) => {
  if (id === undefined || id === null) return value;
  const idType = typeof id;

  switch (idType) {
    case 'string':
      return (value as number | boolean).toString();
    case 'number':
      return Number(value);
    case 'boolean':
      return Boolean(value);
    default:
      return value;
  }
};

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
    localeStr,
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
}

/* ---------- Filter Chips ---------- */
interface FilterChip<T> {
  filterIndex: number;
  column: DynamicColumns<T>;
  activeFilters?: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  localeStr: i18nStrings['filters'];
}

export function FilterChip<T>(props: FilterChip<T>) {
  const { filterIndex, column, activeFilters, setActiveFilters, localeStr } = props;

  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const handleChipClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const foundFilter = useMemo(
    () =>
      activeFilters?.find(
        (filter) => filter?.filterColumn === column.accessor && filter?.filterIndex === filterIndex,
      ),
    [activeFilters, column.accessor, filterIndex],
  );
  const filterValue = useMemo(() => foundFilter?.filterValue ?? null, [foundFilter?.filterValue]);
  const selectedFilterOption = useMemo(
    () => column.filterOptions?.options?.find((option) => option.id === filterValue),
    [column.filterOptions, filterValue],
  );

  const chipLabel = useMemo(() => {
    switch (column.filterOptions?.type) {
      case 'select':
        return selectedFilterOption?.label;
      case 'date': {
        if (
          foundFilter?.filterComparator === 'dateMin' ||
          foundFilter?.filterComparator === 'dateMax'
        ) {
          const dateMin = activeFilters?.find(
            (filter) =>
              filter?.filterColumn === column.accessor && filter?.filterComparator === 'dateMin',
          );
          const dateMax = activeFilters?.find(
            (filter) =>
              filter?.filterColumn === column.accessor && filter?.filterComparator === 'dateMax',
          );
          return `${
            dateMin ? new Date(dateMin?.filterValue as string).toLocaleDateString() : ''
          } - ${dateMax ? new Date(dateMax?.filterValue as string).toLocaleDateString() : ''}`;
        }
        return new Date((filterValue as string) ?? '').toLocaleDateString();
      }
      default:
        return (filterValue as string) ?? '';
    }
  }, [
    column.filterOptions?.type,
    column.accessor,
    selectedFilterOption?.label,
    filterValue,
    foundFilter?.filterComparator,
    activeFilters,
  ]);

  const clearFilter = useCallback(
    (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      e.stopPropagation();
      updateFilters(undefined, filterIndex, '', column, setActiveFilters);
      handleClose();
    },
    [filterIndex, column, setActiveFilters],
  );

  return (
    <Grid>
      <Chip
        clickable
        skipFocusWhenDisabled
        variant="outlined"
        size="medium"
        onClick={handleChipClick}
        icon={
          filterValue !== null ? (
            <Tooltip title={localeStr?.removeFilter} arrow>
              <XCircleIcon
                size={18}
                color={theme.palette.action.active}
                onClick={clearFilter}
                style={{ marginLeft: 4 }}
              />
            </Tooltip>
          ) : (
            <Tooltip title={localeStr?.addFilter} arrow>
              <PlusCircleIcon
                size={18}
                color={theme.palette.action.active}
                style={{ marginLeft: 4 }}
              />
            </Tooltip>
          )
        }
        onDelete={filterValue !== null ? handleChipClick : undefined}
        deleteIcon={<ChevronDownIcon size={18} color={theme.palette.action.active} />}
        label={
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            flexWrap="nowrap"
            spacing={1}
          >
            <Grid>
              <Typography variant="subtitle2" fontWeight="light">
                {column.label}
              </Typography>
            </Grid>

            {filterValue !== null && (
              <>
                <Divider orientation="vertical" flexItem />

                <Grid>
                  <Typography variant="subtitle2" color="primary">
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
          },
        }}
      >
        <Grid container size={12} p={2} gap={1} maxWidth={300}>
          <Grid size={12}>
            <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">
              {`${localeStr?.filterBy} ${column.label}`}
            </Typography>
          </Grid>

          <Grid size={12}>
            <FilterSwitcher
              column={column}
              filterMode="single"
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

  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const handleChipClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const [selectedColumn, setSelectedColumn] = useState<DynamicColumns<T> | null>(null);
  const handleColumnSelect = (column: DynamicColumns<T>) => {
    setSelectedColumn(column);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedColumn(null);
  };

  return (
    <Grid>
      <Chip
        clickable
        skipFocusWhenDisabled
        variant="outlined"
        size="medium"
        onClick={handleChipClick}
        icon={
          <Tooltip title={localeStr?.addFilter} arrow>
            <PlusCircleIcon
              size={18}
              color={theme.palette.action.active}
              style={{ marginLeft: 4 }}
            />
          </Tooltip>
        }
        label={
          <Typography variant="subtitle2" fontWeight="light">
            {localeStr?.moreFilters}
          </Typography>
        }
        deleteIcon={<ChevronDownIcon size={18} color={theme.palette.action.active} />}
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
          },
        }}
      >
        <Grid container size={12} gap={1} maxWidth={300}>
          {!selectedColumn ? (
            <List dense sx={{ width: 200 }}>
              {columns.map((column) => {
                return (
                  <ListItemButton
                    key={column.accessor}
                    alignItems="center"
                    onClick={() => handleColumnSelect(column)}
                  >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <PlusCircleIcon
                        size={18}
                        color={theme.palette.action.active}
                        style={{ marginLeft: 0 }}
                      />
                    </ListItemIcon>
                    <ListItemText>{column.label}</ListItemText>
                  </ListItemButton>
                );
              })}
            </List>
          ) : (
            <Grid container size={12} gap={1} p={2}>
              <Grid container size={12} justifyContent="flex-start" alignItems="center" gap={1}>
                <Grid>
                  <IconButton size="small" onClick={() => setSelectedColumn(null)}>
                    <ChevronLeftIcon size={18} color={theme.palette.action.active} />
                  </IconButton>
                </Grid>

                <Grid>
                  <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">
                    {`${localeStr?.filterBy} ${selectedColumn?.label}`}
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
  $gte: ['dateMin', 'dateFrom'],
  $lte: ['dateMax', 'dateTo'],
  $gt: 'dateFrom',
  $lt: 'dateTo',
  $eq: 'exact',
  gte: ['dateMin', 'dateFrom'],
  lte: ['dateMax', 'dateTo'],
  gt: 'dateFrom',
  lt: 'dateTo',
  eq: 'exact',
};

interface ChipItems<T> extends DynamicColumns<T> {
  filterIndex?: number;
}

export interface DynamicSimpleFiltersProps<T> {
  columns: DynamicColumns<T>[];
  filterMode?: 'single' | 'multiple';
  defaultShowFilters?: boolean;
  filtersQuery?: ActiveFilter[] | string;
  activeFilters: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  fetchEvent: (fetchType?: 'first' | 'next') => Promise<void>;
  setCurrentPage?: Dispatch<SetStateAction<number>>;
  setHighestFetchedPage?: Dispatch<SetStateAction<number>>;
  setAreFiltersLoaded?: Dispatch<SetStateAction<boolean>>;
  refreshButton?: CustomIconButton;
  showRefreshButton: boolean;
  localeStr: i18nStrings['filters'];
}

export function DynamicSimpleFilters<T>(props: DynamicSimpleFiltersProps<T>) {
  const {
    columns,
    filterMode = 'multiple',
    defaultShowFilters,
    filtersQuery,
    activeFilters,
    setActiveFilters,
    fetchEvent,
    setCurrentPage,
    setHighestFetchedPage,
    setAreFiltersLoaded,
    refreshButton,
    showRefreshButton,
    localeStr,
  } = props;

  const isFilterActive = useMemo(() => {
    return (column: DynamicColumns<T>) =>
      activeFilters.some(
        (filter) =>
          filter?.filterColumn === column.accessor &&
          filter?.filterType === column.filterOptions?.type,
      );
  }, [activeFilters]);

  const filterableColumns = useMemo(
    () =>
      columns.filter((column) => column.filterOptions && typeof column.filterOptions === 'object'),
    [columns],
  );
  const priorityFilterColumns = useMemo(
    () =>
      filterableColumns.filter(
        (column) => column.filterOptions?.priority || isFilterActive(column),
      ),
    [filterableColumns, isFilterActive],
  );

  // visible columns that have filters
  const visibleFilterColumns = useMemo(() => {
    return priorityFilterColumns.length > 0 ? priorityFilterColumns : filterableColumns;
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
      .map((filter) => {
        const matchingColumn = visibleFilterColumns?.find(
          (column) =>
            column.accessor === filter?.filterColumn &&
            column.filterOptions?.type === filter?.filterType,
        );

        // skips dateMax filter since the provided dateMin filter is enough to avoid duplicates
        if (filter?.filterType === 'date' && filter?.filterComparator === 'dateMax')
          return undefined;

        const updatedColumn = {
          ...matchingColumn,
          filterIndex: filter?.filterIndex,
        } as ChipItems<T>;

        return matchingColumn && filter?.filterIndex ? updatedColumn : undefined;
      })
      .filter((filter) => filter);

    setVisibleChips(activeFilterChips as ChipItems<T>[]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, columns, filterMode]);

  // columns in the more filters chip
  const moreFilterColumns = useMemo(() => {
    const visibleMoreColumns =
      visibleFilterColumns.length !== filterableColumns.length
        ? filterableColumns.filter(
            (column) => !column.filterOptions?.priority && !isFilterActive(column),
          )
        : [];

    return filterMode === 'single' ? visibleMoreColumns : filterableColumns;
  }, [filterMode, filterableColumns, isFilterActive, visibleFilterColumns]);

  // single text filter for the search bar
  const singleTextFilter = useMemo(
    () =>
      filterableColumns.length === 1
        ? filterableColumns.find((column) => column.filterOptions?.type === 'string')
        : undefined,
    [filterableColumns],
  );

  const clearAllFilters = useCallback(() => {
    if (activeFilters.length > 0) setActiveFilters([]);
    setVisibleChips(visibleFilterColumns);
  }, [activeFilters, setActiveFilters, visibleFilterColumns]);

  /* Load filters from querystring */
  useEffect(() => {
    if (!filtersQuery) {
      if (activeFilters.length > 0) setActiveFilters([]);
      return;
    }

    // comparison needed to avoid double calls (filters can be updated both by UI & querystring)
    const applyFilters = (nextFilters: ActiveFilter[]) => {
      if (serializeFilters(nextFilters) === serializeFilters(activeFilters)) return;
      setActiveFilters(nextFilters);
    };

    if (typeof filtersQuery === 'string') {
      const parsedObject = qs.parse(filtersQuery, { ignoreQueryPrefix: true });
      const filterQuery =
        (parsedObject.filter as Record<string, unknown>) ?? ({} as Record<string, unknown>);

      const columnIndexMap: Record<string, number> = {};
      const seenFilters = new Map<string, ActiveFilter>();

      const ensureIndex = (column: string) => {
        if (columnIndexMap[column] === undefined) columnIndexMap[column] = 0;
        return columnIndexMap[column];
      };

      const incrementIndex = (column: string, step = 1) => {
        columnIndexMap[column] = ensureIndex(column) + step;
      };

      const registerFilter = (filter: ActiveFilter) => {
        const comparatorKey = filter.filterComparator ?? 'exact';
        const key = `${filter.filterColumn}|${filter.filterIndex}|${comparatorKey}`;
        seenFilters.set(key, filter);
      };

      Object.entries(filterQuery).forEach(([filterColumn, rawValue]) => {
        const targetColumn = columns.find(
          (column) => column.filterOptions && column.accessor === filterColumn,
        );
        const filterType = targetColumn?.filterOptions?.type;

        if (!filterType) return;

        switch (filterType) {
          case 'string': {
            const filterIndex = ensureIndex(filterColumn);
            registerFilter({
              filterColumn,
              filterValue: rawValue,
              filterIndex,
              filterType: 'string',
            });
            incrementIndex(filterColumn);
            break;
          }
          case 'number': {
            const filterIndex = ensureIndex(filterColumn);
            registerFilter({
              filterColumn,
              filterValue: Number(rawValue),
              filterIndex,
              filterType: 'number',
            });
            incrementIndex(filterColumn);
            break;
          }
          case 'select': {
            const values = Array.isArray(rawValue) ? rawValue : [rawValue];
            const baseIndex = ensureIndex(filterColumn);
            values.forEach((value, offset) => {
              registerFilter({
                filterColumn,
                filterValue: typeConverter(
                  typeof targetColumn.filterOptions?.options?.[0]?.id,
                  value,
                ),
                filterIndex: baseIndex + offset,
                filterType: 'select',
              });
            });
            incrementIndex(filterColumn, values.length);
            break;
          }
          case 'date': {
            const filterIndex = ensureIndex(filterColumn);
            if (typeof rawValue === 'object' && rawValue !== null) {
              const entries = Object.entries(rawValue as Record<string, unknown>);
              entries.forEach(([dateComparator, dateValue]) => {
                const comparatorKey = comparatorMap[dateComparator];
                const filterComparator = Array.isArray(comparatorKey)
                  ? comparatorKey[entries.length > 1 ? 0 : 1] ?? 'exact'
                  : comparatorKey ?? 'exact';

                registerFilter({
                  filterColumn,
                  filterValue: typeConverter(
                    typeof targetColumn.filterOptions?.options?.[0]?.id,
                    dateValue,
                  ),
                  filterIndex,
                  filterType: 'date',
                  filterComparator,
                });
              });
            } else {
              registerFilter({
                filterColumn,
                filterValue: typeConverter(
                  typeof targetColumn.filterOptions?.options?.[0]?.id,
                  rawValue,
                ),
                filterIndex,
                filterType: 'date',
                filterComparator: 'exact',
              });
            }
            incrementIndex(filterColumn);
            break;
          }
          default: {
            const filterIndex = ensureIndex(filterColumn);
            registerFilter({
              filterColumn,
              filterValue: rawValue,
              filterIndex,
            });
            incrementIndex(filterColumn);
          }
        }
      });

      applyFilters(Array.from(seenFilters.values()));
    } else {
      applyFilters(filtersQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersQuery]);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      setCurrentPage?.(0);
      setHighestFetchedPage?.(-1);
      setAreFiltersLoaded?.(true);
      await fetchEvent('first');
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters]);

  const handleRefetchTable = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setCurrentPage?.(0);
      setHighestFetchedPage?.(-1);
      if (!filtersQuery) {
        setActiveFilters([]);
      } else {
        await fetchEvent('first');
      }
      refreshButton?.buttonClick?.(e);
    },
    [
      fetchEvent,
      filtersQuery,
      refreshButton,
      setActiveFilters,
      setCurrentPage,
      setHighestFetchedPage,
    ],
  );

  const handleSpinRefresh = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.currentTarget;
    target.classList.remove('spinning');
    void target.offsetWidth;
    target.classList.add('spinning');
    setTimeout(() => {
      target.classList.remove('spinning');
    }, 500);
  }, []);

  const [showFilters, setShowFilters] = useState<boolean>(
    defaultShowFilters !== undefined ? defaultShowFilters : true,
  );

  const handleToggleFilters = () => setShowFilters((prev) => !prev);

  return (
    <Grid
      component="div"
      container
      justifyContent="flex-start"
      alignItems="center"
      flexGrow={1}
      spacing={1}
      p={1}
    >
      {showFilters &&
        (singleTextFilter ? (
          <Grid container justifyContent="flex-start" alignItems="center" flexGrow={1} padding={1}>
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
          <Grid container justifyContent="flex-start" alignItems="center" flexGrow={1}>
            {visibleFilterColumns.map((column) => (
              <FilterChip
                key={column.accessor}
                filterIndex={0}
                column={column}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                localeStr={localeStr}
              />
            ))}

            {visibleChips.map((column) => (
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

            {activeFilters.length > 0 && (
              <Grid>
                <Chip
                  clickable
                  label={
                    <Typography variant="body2" fontWeight="light">
                      {localeStr?.clear}
                    </Typography>
                  }
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={clearAllFilters}
                  sx={{ borderStyle: 'none' }}
                />
              </Grid>
            )}

            {showRefreshButton && (
              <Grid>
                <Tooltip title={refreshButton?.label ?? localeStr?.refresh} arrow>
                  <IconButton
                    size="medium"
                    color="primary"
                    onClick={handleRefetchTable}
                    onMouseDown={handleSpinRefresh}
                    sx={{
                      '@keyframes spin': {
                        from: { transform: 'rotate(0deg)' },
                        to: { transform: 'rotate(360deg)' },
                      },
                      '&.spinning': {
                        animation: 'spin 0.5s ease-in-out',
                      },
                    }}
                  >
                    {refreshButton?.icon ?? <RotateCwIcon size={20} />}
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
          </Grid>
        ))}

      {!showFilters && (
        <Grid flexGrow={1}>
          <span />
        </Grid>
      )}

      {defaultShowFilters !== undefined && (
        <Grid>
          <Tooltip title={showFilters ? localeStr?.hideFilters : localeStr?.showFilters} arrow>
            <IconButton size="medium" color="primary" onClick={handleToggleFilters}>
              {showFilters ? <FunnelIcon size={20} /> : <FunnelXIcon size={20} />}
            </IconButton>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
}
