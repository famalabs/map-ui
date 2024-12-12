import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from "@mui/material/Grid2";
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import qs from 'qs';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { DateFilterForm, NumberFilterForm, SelectFilterForm, StringFilterForm, updateFilters } from './DynamicFilters';
import { ActiveFilter, DynColumnsDef, i18nStrings } from './DynamicTypes';


/* ---------- Filter Switcher ---------- */

interface FilterSwitcherProps<T> {
  column: DynColumnsDef<T>;
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
  column: DynColumnsDef<T>;
  activeFilters?: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  localeStr: i18nStrings['filters'];
}

export function FilterChip<T>(props: FilterChip<T>) {

  const { filterIndex, column, activeFilters, setActiveFilters, localeStr } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const handleClose = () => setAnchorEl(null);
  const handleChipClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const filterValue = useMemo(() => activeFilters?.find(filter => filter.filterColumn === column.accessor && filter.filterIndex === filterIndex)?.filterValue ?? null, [activeFilters, column.accessor, filterIndex]);
  const selectedFilterOption = useMemo(() => column.filterOptions?.options?.find(option => option.id === filterValue), [column.filterOptions, filterValue]);

  const chipLabel = useMemo(() => {
    switch (column.filterOptions?.type) {
      case 'select':
        return selectedFilterOption?.label;
      case 'date': {
        return new Date(filterValue as string).toLocaleDateString();
      }
      default:
        return filterValue as string;
    }
  }, [column.filterOptions?.type, selectedFilterOption?.label, filterValue]);


  const clearFilter = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    updateFilters(undefined, filterIndex, '', column, setActiveFilters);
    handleClose();
  }

  return (
    <Grid p={1}>
      <Chip
        clickable
        skipFocusWhenDisabled
        variant='outlined'
        size='medium'
        onClick={handleChipClick}
        icon={filterValue
          ? (
            <Tooltip title={localeStr.removeFilter} arrow>
              <HighlightOffIcon
                fontSize='small'
                color='action'
                onClick={clearFilter}
              />
            </Tooltip>
        )
          : (
            <Tooltip title={localeStr.addFilter} arrow>
              <AddCircleOutlineIcon fontSize='small' color='action' />
            </Tooltip>
          )
        }
        onDelete={filterValue ? handleChipClick : undefined}
        deleteIcon={<KeyboardArrowDownIcon fontSize='small' />}
        label={
          <Grid
            container
            justifyContent='space-between'
            alignItems='center'
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

            {filterValue && (
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
          borderStyle: 'dashed',
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
              {`${localeStr.filterBy} ${column.label}`}
            </Typography>
          </Grid>

          <Grid size={12}>
            <FilterSwitcher
              column={column}
              filterMode='single'
              filterIndex={filterIndex}
              activeFilters={activeFilters}
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
  columns: DynColumnsDef<T>[];
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

  const [selectedColumn, setSelectedColumn] = useState<DynColumnsDef<T> | null>(null);
  const handleColumnSelect = (column: DynColumnsDef<T>) => {
    setSelectedColumn(column);
  }
  
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedColumn(null);
  }

  return (
    <Grid p={1}>
      <Chip
        clickable
        skipFocusWhenDisabled
        variant='outlined'
        size='medium'
        onClick={handleChipClick}
        icon={
          <Tooltip title={localeStr.addFilter} arrow>
            <AddCircleOutlineIcon fontSize='small' color='action' />
          </Tooltip>
        }
        label={
          <Typography
            variant='body2'
            fontWeight='light'
          >
            {localeStr.moreFilters}
          </Typography>
        }
        deleteIcon={<KeyboardArrowDownIcon fontSize='small' />}
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

interface ChipItems<T> extends DynColumnsDef<T> {
  filterIndex?: number;
}

export interface DynamicSimpleFiltersProps<T> {
  columns: DynColumnsDef<T>[];
  filterMode: 'single' | 'multiple';
  onLoadQuery?: string;
  activeFilters: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  localeStr: i18nStrings['filters'];
}

export function DynamicSimpleFilters<T>(props: DynamicSimpleFiltersProps<T>) {

  const { columns, filterMode, onLoadQuery, activeFilters, setActiveFilters, localeStr } = props;

  const isFilterActive = useMemo(() => {
    return (column: DynColumnsDef<T>) => activeFilters.some(filter =>
      filter.filterColumn === column.accessor
      && filter.filterType === column.filterOptions?.type
    );
  }, [activeFilters]);

  const filterableColumns = columns.filter(column => column.filterOptions);
  const priorityFilterColumns = filterableColumns.filter(column => column.filterOptions?.priority || isFilterActive(column));

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
        const matchingColumn = visibleFilterColumns.find(
          column => column.accessor === filter.filterColumn
          && column.filterOptions?.type === filter.filterType
        );

        // skips dateMax filter since the provided dateMin filter is enough to avoid duplicates
        if (filter.filterType === 'date' && filter.filterComparator === 'dateMax') return undefined;

        const updatedColumn = {
          ...matchingColumn,
          filterIndex: filter.filterIndex,
        } as ChipItems<T>;

        return matchingColumn && filter.filterIndex ? updatedColumn : undefined;
      })
      .filter(filter => filter);

    console.log('Active filter chips: ', activeFilterChips);

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
  const singleTextFilter = filterableColumns.length === 1
    ? filterableColumns.find(column => column.filterOptions?.type === 'string')
    : undefined;

  const clearAllFilters = useCallback(() => {
    if (activeFilters.length > 0) setActiveFilters([]);
    setVisibleChips(visibleFilterColumns);
  }, [activeFilters, setActiveFilters, visibleFilterColumns]);

  /* Load filters from querystring */
  useEffect(() => {
    if (!onLoadQuery) return;

    const parsedObject = qs.parse(onLoadQuery, { ignoreQueryPrefix: true });
    const filterQuery = parsedObject.filter as Record<string, any> ?? {} as Record<string, any>;

    const updatedActiveFilters = Object.entries(filterQuery).map(([filterColumn, filterValue]) => {
      const selectColumn = columns.find(column => (column.filterOptions && column.filterOptions.type === 'select') && column.accessor === filterColumn);
      switch (typeof selectColumn?.filterOptions?.options?.[0].id) {
        case 'string':
          return { filterColumn, filterValue } as ActiveFilter;
        case 'number':
          return { filterColumn, filterValue: Number(filterValue) } as ActiveFilter;
        case 'boolean':
          return { filterColumn, filterValue: JSON.parse(filterValue.toLowerCase()) } as ActiveFilter;
        default:
          return { filterColumn, filterValue } as ActiveFilter;
      }
    });

    setActiveFilters(updatedActiveFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      size={{
        sm: 8,
        md: 8
      }}
    >

      {singleTextFilter ? (
        <Grid padding={1}>
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
            size={12}
            justifyContent='flex-start'
            alignItems='center'
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
                      {localeStr.clear}
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

          </Grid>
      )}


    </Grid>
  );
}