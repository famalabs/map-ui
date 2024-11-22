import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from "@mui/material/Grid2";
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/it';
import qs from 'qs';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { ActiveFilter, DynamicFilterOptions, DynColumnsDef, FilterValue } from './DynamicTypes';
import dayjs from 'dayjs';

/* ---------- Update Filters Function ---------- */

function updateFilters<T>(
  value: unknown,
  column: DynColumnsDef<T>,
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>,
) {
  setActiveFilters(prevFilters => {

    const filterIndex = prevFilters.findIndex(filter => filter.filterColumn === column.accessor);

    if (value === undefined || value === '') {
      return prevFilters.filter((filter, index) => index !== filterIndex);
    }

    const currentFilter = {
      filterColumn: column.accessor,
      filterValue: value,
      filterType: column.filterOptions?.type,
    } as ActiveFilter;

    if (filterIndex === -1) {
      return [...prevFilters, currentFilter];
    } else {
      return prevFilters.map((filter, index) => index === filterIndex ? currentFilter : filter);
    }

  });
}

/* ---------- Filter Switcher ---------- */

interface FilterSwitcherProps<T> {
  column: DynColumnsDef<T>;
  filterValue: FilterValue;
  selectedFilterOption?: DynamicFilterOptions;
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  handleClose: () => void;
}

function FilterSwitcher<T>(props: FilterSwitcherProps<T>) {

  const { column, filterValue, selectedFilterOption, setActiveFilters, handleClose } = props;

  switch (column.filterOptions?.type) {
    case 'string':
      return (
        <StringFilterForm
          key={column.accessor}
          column={column}
          filterValue={filterValue}
          setActiveFilters={setActiveFilters}
          closePopover={handleClose}
        />
      );

    case 'select':
      return (
        <SelectFilterForm
          key={column.accessor}
          column={column}
          selectedFilterOption={selectedFilterOption}
          setActiveFilters={setActiveFilters}
          closePopover={handleClose}
        />
      );

    case 'date':
      return (
        <DateFilterForm
          key={column.accessor}
          column={column}
          filterValue={filterValue}
          setActiveFilters={setActiveFilters}
          closePopover={handleClose}
        />
      );

    default:
      return null;
  }
};

/* ---------- String Filter ---------- */

interface StringFilterFormProps<T> {
  column: DynColumnsDef<T>;
  filterValue?: FilterValue;
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  closePopover?: () => void;
  aloneFilter?: boolean;
}

export function StringFilterForm<T>(props: StringFilterFormProps<T>) {

  const {
    column,
    filterValue,
    setActiveFilters,
    closePopover,
    aloneFilter = false
  } = props;

  const [inputValue, setInputValue] = useState<string>(filterValue?.toString() ?? '');

  useEffect(() => {
    if (aloneFilter) {
      setInputValue(filterValue?.toString() ?? '');
    }
  }, [filterValue, aloneFilter]);

  const handleApply = () => {
    updateFilters(inputValue, column, setActiveFilters);
    closePopover?.();
  };

  return (
    <Grid
      container
      alignItems="center"
      gap={2}
    >
      <Grid size={12}>
        <TextField
          fullWidth
          size="small"
          label={!aloneFilter ? column.label : ''}
          placeholder={aloneFilter ? column.label : ''}
          variant="outlined"
          value={inputValue}
          onChange={aloneFilter
            ? (event) => updateFilters(event.target.value, column, setActiveFilters)
            : (event) => setInputValue(event.target.value)
          }
          aria-label="filter-text"
          slotProps={{
            input: {
              startAdornment: aloneFilter && (
                <SearchIcon sx={{ marginRight: '.4rem' }} />
              ),
              endAdornment: (
                <IconButton
                  size="small"
                  onClick={aloneFilter
                    ? () => updateFilters('', column, setActiveFilters)
                    : () => setInputValue('')
                  }
                  sx={{ visibility: inputValue ? 'visible' : 'hidden' }}
                  aria-label="clear-filter"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              ),
            }
          }}
        />
      </Grid>
      {!aloneFilter &&
        <Grid size={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="small"
            onClick={handleApply}
            disabled={inputValue === (filterValue ?? '')}
            aria-label="apply-filter"
          >
            Apply
          </Button>
        </Grid>
      }
    </Grid>
  );
}

/* ---------- Select Filter ---------- */

interface SelectFilterFormProps<T> {
  column: DynColumnsDef<T>;
  selectedFilterOption?: DynamicFilterOptions;
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  closePopover: () => void;
}

export function SelectFilterForm<T>(props: SelectFilterFormProps<T>) {

  const {
    column,
    selectedFilterOption,
    setActiveFilters,
    closePopover,
  } = props;

  const [localSelectedOption, setLocalSelectedOption] = useState<DynamicFilterOptions | null>(
    selectedFilterOption ?? null
  );

  const handleApply = () => {
    updateFilters(localSelectedOption ? localSelectedOption.id : undefined, column, setActiveFilters);
    closePopover();
  };

  return (
    <Grid
      container
      alignItems="center"
      gap={1}
    >
      <Grid size={12}>
        <Autocomplete
          size='small'
          blurOnSelect
          clearOnBlur
          defaultValue={selectedFilterOption}
          onChange={(event, option, reason) => {
            if (reason === 'selectOption') {
              setLocalSelectedOption(option);
            } else if (reason === 'clear') {
              setLocalSelectedOption(null);
            }
          }}
          options={column.filterOptions?.options ?? []}
          getOptionLabel={(option) => option.label}
          getOptionKey={(option) => option.id as any}
          renderOption={(props, option) => <ListItem {...props}>{option.label}</ListItem>}
          renderInput={
            (params) => (
              <TextField
                {...params}
                label={column.label}
              />)
          }
          aria-label='filter-select'
        />
      </Grid>
      <Grid size={12}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="small"
          onClick={handleApply}
          disabled={localSelectedOption?.id === selectedFilterOption?.id}
          aria-label="apply-filter"
        >
          Apply
        </Button>
      </Grid>
    </Grid>
  );
}

/* ---------- Date Filter ---------- */

interface DateFilterFormProps<T> {
  column: DynColumnsDef<T>;
  filterValue?: FilterValue;
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  closePopover: () => void;
}

export function DateFilterForm<T>(props: DateFilterFormProps<T>) {

  const {
    column,
    filterValue,
    setActiveFilters,
    closePopover,
  } = props;

  const [localDate, setValue] = useState<{ date_start: string, date_end: string }>({
    date_start: filterValue?.toString().split('|')[0] ?? '',
    date_end: filterValue?.toString().split('|')[1] ?? '',
  });

  const updateDateRange = (start: string, end: string) => {
    setValue(prevDate => ({
      date_start: start ?? prevDate.date_start,
      date_end: end ?? prevDate.date_end,
    }));
  }

  const applyFilters = () => {
    updateFilters(`${localDate.date_start}|${localDate.date_end}`, column, setActiveFilters);
    closePopover();
  };

  const isApplyDisabled = useMemo(() => {
    return localDate.date_start === (filterValue as string)?.split('|')[0] && localDate.date_end === (filterValue as string)?.split('|')[1];
  }, [filterValue, localDate.date_start, localDate.date_end]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
      <Grid
        container
        size={12}
        alignItems="center"
        gap={1}
      >
        <Grid size={12}>
          <DatePicker
            label="Data Inizio"
            defaultValue={localDate.date_start ? dayjs(localDate.date_start) : null}
            onChange={(date, context) => !context.validationError ? updateDateRange(date?.toISOString(), undefined) : null}
            sx={{
              width: '100%',
            }}
          />
        </Grid>
        <Grid size={12}>
          <DatePicker
            label="Data Fine"
            defaultValue={localDate.date_end ? dayjs(localDate.date_end) : null}
            onChange={(date, context) => !context.validationError ? updateDateRange(undefined, date?.toISOString()) : null}
            sx={{
              width: '100%',
            }}
          />
        </Grid>
        <Grid size={12}>
          <Button
            fullWidth
            variant='contained'
            color='primary'
            size='small'
            onClick={applyFilters}
            disabled={isApplyDisabled}
          >
            Apply
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}

/* ---------- Filter Chips ---------- */

interface FilterChip<T> {
  column: DynColumnsDef<T>;
  activeFilters?: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
}

export function FilterChip<T>(props: FilterChip<T>) {

  const { column, activeFilters, setActiveFilters } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const handleClose = () => setAnchorEl(null);
  const handleChipClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const filterValue = useMemo(() => activeFilters?.find(filter => filter.filterColumn === column.accessor)?.filterValue ?? null, [activeFilters, column.accessor]);
  const selectedFilterOption = useMemo(() => column.filterOptions?.options?.find(option => option.id === filterValue), [column.filterOptions, filterValue]);

  const dateFilterValue = useMemo(() => {
    if (column.filterOptions?.type !== 'date') return '';

    const dateValue = filterValue as string;
    const isoDateStart = dateValue?.split('|')[0];
    const isoDateEnd = dateValue?.split('|')[1];

    const dateStart = isoDateStart ? dayjs(isoDateStart).format('DD/MM/YYYY') : '';
    const dateEnd = isoDateEnd ? dayjs(isoDateEnd).format('DD/MM/YYYY') : '';

    const formattedDate = dateEnd ? `${dateStart} - ${dateEnd}` : dateStart;
    return formattedDate;


  }, [column.filterOptions?.type, filterValue]);

  const chipLabel = useMemo(() => {
    switch (column.filterOptions?.type) {
      case 'select':
        return selectedFilterOption?.label;
      case 'date':
        return dateFilterValue;
      default:
        return filterValue as string;
    }
  }, [column.filterOptions?.type, selectedFilterOption?.label, dateFilterValue, filterValue]);


  const clearFilter = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    updateFilters(undefined, column, setActiveFilters);
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
          ? <HighlightOffIcon
            fontSize='small'
            color='action'
            onClick={clearFilter}
          />
          : <AddCircleOutlineIcon fontSize='small' color='action' />
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
            <Grid height={'18px'}>
              <Typography
                variant='body2'
              >
                {column.label}
              </Typography>
            </Grid>

            {filterValue && (
              <>
                <Divider orientation='vertical' flexItem />

                <Grid height={'18px'}>
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
          borderStyle: !filterValue ? 'dashed' : 'solid',
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
            sx: {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }
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
              {`Filter by ${column.label}`}
            </Typography>
          </Grid>

          <Grid size={12}>
            <FilterSwitcher
              column={column}
              filterValue={filterValue}
              selectedFilterOption={selectedFilterOption}
              setActiveFilters={setActiveFilters}
              handleClose={handleClose}
            />
          </Grid>

        </Grid>
      </Popover>
    </Grid>
  );
}

interface MoreFiltersChipProps<T> {
  columns: DynColumnsDef<T>[];
  activeFilters: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
}

export function MoreFiltersChip<T>(props: MoreFiltersChipProps<T>) {

  const { columns, activeFilters, setActiveFilters } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const handleChipClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const [selectedColumn, setSelectedColumn] = useState<DynColumnsDef<T> | null>(null);
  const handleColumnSelect = (column: DynColumnsDef<T>) => {
    setSelectedColumn(column);
  }

  const filterValue = useMemo(() => activeFilters?.find(filter => filter.filterColumn === selectedColumn?.accessor)?.filterValue ?? null, [activeFilters, selectedColumn?.accessor]);
  const selectedFilterOption = useMemo(() => selectedColumn?.filterOptions?.options?.find(option => option.id === filterValue), [selectedColumn?.filterOptions, filterValue]);

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
        icon={<AddCircleOutlineIcon fontSize='small' color='action' />}
        label='More filters'
        deleteIcon={<KeyboardArrowDownIcon fontSize='small' />}
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
            elevation: 0,
            sx: {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }
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
                    height='18px'
                  >
                    {`Filter by ${selectedColumn?.label}`}
                  </Typography>
                </Grid>
              </Grid>

              <Grid size={12}>
                <FilterSwitcher
                  column={selectedColumn}
                  filterValue={filterValue}
                  selectedFilterOption={selectedFilterOption}
                  setActiveFilters={setActiveFilters}
                  handleClose={handleClose}
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

export interface DynamicSimpleFiltersProps<T> {
  columns: DynColumnsDef<T>[];
  onLoadQuery?: string;
  activeFilters: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
}

export function DynamicSimpleFilters<T>(props: DynamicSimpleFiltersProps<T>) {

  const { columns, onLoadQuery, activeFilters, setActiveFilters } = props;

  const isFilterActive = useMemo(() => {
    return (column: DynColumnsDef<T>) => activeFilters.some(filter => filter.filterColumn === column.accessor);
  }, [activeFilters]);

  const filterableColumns = columns.filter(column => column.filterOptions);
  const priorityFilterColumns = filterableColumns.filter(column => column.filterOptions?.priority || isFilterActive(column));

  const visibleFilterColumns = priorityFilterColumns.length > 0
    ? priorityFilterColumns
    : filterableColumns;

  const moreFilterColumns = useMemo(() => {
    return visibleFilterColumns.length !== filterableColumns.length
      ? filterableColumns.filter(column => !column.filterOptions?.priority && !isFilterActive(column))
      : [];
  }, [filterableColumns, isFilterActive, visibleFilterColumns]);

  const singleTextFilter = filterableColumns.length === 1
    ? filterableColumns.find(column => column.filterOptions?.type === 'string')
    : undefined;

  const singleFilterValue = singleTextFilter
    ? activeFilters.find(filter => filter.filterColumn === singleTextFilter.accessor)?.filterValue
    : undefined;

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

  const RenderChipFilters = useCallback(() => {
    return (
      <Grid
        container
        size={12}
        justifyContent='flex-start'
        alignItems='center'
      >
        <Grid container>
          {visibleFilterColumns.map(column => {
            return (
              <FilterChip
                key={column.accessor}
                column={column}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
              />
            )
          })}

          {moreFilterColumns.length > 0 && (
            <MoreFiltersChip
              columns={moreFilterColumns}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
            />
          )}
        </Grid>

        <Grid>
          <Chip
            clickable
            label='Clear all filters'
            variant='outlined'
            size='small'
            color='primary'
            onClick={() => { if (activeFilters.length > 0) setActiveFilters([]) }}
            sx={{ borderStyle: 'none' }}
          />
        </Grid>

      </Grid>
    );
  }, [activeFilters, moreFilterColumns, setActiveFilters, visibleFilterColumns]);

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
            filterValue={singleFilterValue}
            setActiveFilters={setActiveFilters}
            aloneFilter
          />
        </Grid>
      ) : (
        <RenderChipFilters />
      )}


    </Grid>
  );
}