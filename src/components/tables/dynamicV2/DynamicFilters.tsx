import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { CalendarFoldIcon, SearchIcon, XIcon } from 'lucide-react';
import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { ActiveFilter, DynamicColumns, DynamicFilterOptions, i18nStrings } from './DynamicTypes';
import { SvgIconProps, useTheme } from '@mui/material';

/* ---------- Update Filters Function ---------- */

export function updateFilters<T>(
  value: unknown,
  index: number = 0,
  comparator: string,
  column: DynamicColumns<T>,
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>,
) {
  const normalizedComparator = comparator ?? '';
  const normalizedType = column.filterOptions?.type ?? '';

  setActiveFilters((prevFilters) => {
    const filterIndex = prevFilters.findIndex(
      (filter) =>
        filter.filterColumn === column.accessor &&
        filter.filterIndex === index &&
        (filter.filterComparator ?? '') === normalizedComparator &&
        (filter.filterType ?? '') === normalizedType,
    );

    if (value === null || value === undefined || value === '') {
      return prevFilters.filter(
        (filter) => filter.filterColumn !== column.accessor || filter.filterIndex !== index,
      );
    }

    const currentFilter = {
      filterIndex: index,
      filterColumn: column.accessor,
      filterValue: value,
      filterType: normalizedType,
      filterComparator: normalizedComparator,
    } as ActiveFilter;

    return filterIndex === -1
      ? [...prevFilters, currentFilter]
      : prevFilters.map((filter, idx) => (idx === filterIndex ? currentFilter : filter));
  });
}

/* ---------- String Filter ---------- */

interface StringFilterFormProps<T> {
  column: DynamicColumns<T>;
  filterMode: 'single' | 'multiple';
  activeFilters: ActiveFilter[];
  filterIndex?: number;
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  closePopover?: () => void;
  aloneFilter?: boolean;
  localeStr: i18nStrings['filters'];
}

export function StringFilterForm<T>(props: StringFilterFormProps<T>) {
  const {
    column,
    filterMode,
    activeFilters,
    filterIndex,
    setActiveFilters,
    closePopover,
    aloneFilter = false,
    localeStr,
  } = props;

  const filterValue = useMemo(
    () =>
      activeFilters?.find(
        (filter) => filter.filterColumn === column.accessor && filter.filterIndex === filterIndex,
      )?.filterValue ?? null,
    [activeFilters, column.accessor, filterIndex],
  );

  const [inputValue, setInputValue] = useState<string>(
    filterMode === 'single' && filterValue ? filterValue?.toString() : '',
  );

  if (filterValue && aloneFilter) {
    setInputValue(filterValue?.toString() ?? '');
  }

  const handleApply = useCallback(() => {
    const columnFilters =
      filterIndex ??
      (activeFilters.filter((filter) => filter.filterColumn === column.accessor)?.length || 0);

    updateFilters(inputValue, columnFilters, '', column, setActiveFilters);
    closePopover?.();
  }, [activeFilters, closePopover, column, filterIndex, inputValue, setActiveFilters]);

  const isApplyDisabled = useMemo(
    () => inputValue === filterValue || !inputValue,
    [inputValue, filterValue],
  );

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid size={12}>
        <TextField
          fullWidth
          size="small"
          label={!aloneFilter ? column.label : ''}
          placeholder={aloneFilter ? column.label : ''}
          variant="outlined"
          value={aloneFilter ? activeFilters[0]?.filterValue ?? '' : inputValue}
          onChange={
            aloneFilter
              ? (event) => updateFilters(event.target.value, 0, '', column, setActiveFilters)
              : (event) => setInputValue(event.target.value)
          }
          aria-label="filter-text"
          slotProps={{
            input: {
              startAdornment: aloneFilter && <SearchIcon style={{ marginRight: '.4rem' }} />,
              endAdornment: (
                <IconButton
                  size="small"
                  onClick={aloneFilter ? () => setActiveFilters([]) : () => setInputValue('')}
                  sx={{
                    visibility: aloneFilter
                      ? activeFilters.length
                        ? 'visible'
                        : 'hidden'
                      : inputValue
                      ? 'visible'
                      : 'hidden',
                  }}
                  aria-label="clear-filter"
                >
                  <XIcon size={18} />
                </IconButton>
              ),
            },
          }}
        />
      </Grid>
      {!aloneFilter && (
        <Grid size={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="small"
            onClick={handleApply}
            disabled={isApplyDisabled}
            aria-label="apply-filter"
          >
            {localeStr?.apply}
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

/* ---------- Number Filter ---------- */

interface NumberFilterFormProps<T> {
  column: DynamicColumns<T>;
  filterMode: 'single' | 'multiple';
  activeFilters: ActiveFilter[];
  filterIndex?: number;
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  closePopover?: () => void;
  aloneFilter?: boolean;
  localeStr: i18nStrings['filters'];
}

export function NumberFilterForm<T>(props: NumberFilterFormProps<T>) {
  const {
    column,
    filterMode,
    activeFilters,
    filterIndex,
    setActiveFilters,
    closePopover,
    aloneFilter = false,
    localeStr,
  } = props;

  const filterValue = useMemo(
    () =>
      activeFilters?.find(
        (filter) => filter.filterColumn === column.accessor && filter.filterIndex === filterIndex,
      )?.filterValue ?? null,
    [activeFilters, column.accessor, filterIndex],
  );

  const [inputValue, setInputValue] = useState<number | null>(
    filterMode === 'single' ? Number(filterValue) : null,
  );
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isNaN(Number(event.target.value))) {
      setInputValue(null);
      return;
    }
    if (aloneFilter) {
      updateFilters(event.target.value, 0, '', column, setActiveFilters);
    } else {
      setInputValue(Number(event.target.value) || null);
    }
  };

  if (filterValue && aloneFilter) {
    setInputValue(Number(filterValue) || null);
  }

  const handleApply = useCallback(() => {
    const columnFilters =
      filterIndex ??
      activeFilters.filter((filter) => filter.filterColumn === column.accessor)?.length ??
      null;
    updateFilters(inputValue, columnFilters, '', column, setActiveFilters);
    closePopover?.();
  }, [activeFilters, closePopover, column, filterIndex, inputValue, setActiveFilters]);

  const isApplyDisabled = useMemo(
    () => inputValue === filterValue || inputValue === null || inputValue === undefined,
    [inputValue, filterValue],
  );

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid size={12}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label={!aloneFilter ? column.label : ''}
          placeholder={aloneFilter ? column.label : ''}
          variant="outlined"
          value={aloneFilter ? activeFilters[0]?.filterValue ?? null : inputValue}
          onChange={handleInputChange}
          aria-label="filter-number"
          slotProps={{
            input: {
              type: 'number',
              startAdornment: aloneFilter && <SearchIcon style={{ marginRight: '.4rem' }} />,
              endAdornment: filterValue ? (
                <IconButton
                  size="small"
                  onClick={aloneFilter ? () => setActiveFilters([]) : () => setInputValue(null)}
                  sx={{
                    visibility: aloneFilter
                      ? activeFilters.length
                        ? 'visible'
                        : 'hidden'
                      : inputValue
                      ? 'visible'
                      : 'hidden',
                  }}
                  aria-label="clear-filter"
                >
                  <XIcon size={18} />
                </IconButton>
              ) : null,
            },
          }}
        />
      </Grid>
      {!aloneFilter && (
        <Grid size={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="small"
            onClick={handleApply}
            disabled={isApplyDisabled}
            aria-label="apply-filter"
          >
            {localeStr?.apply}
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

/* ---------- Select Filter ---------- */

interface SelectFilterFormProps<T> {
  column: DynamicColumns<T>;
  filterMode: 'single' | 'multiple';
  filterIndex?: number;
  activeFilters: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  closePopover: () => void;
  localeStr: i18nStrings['filters'];
}

export function SelectFilterForm<T>(props: SelectFilterFormProps<T>) {
  const {
    column,
    filterMode,
    activeFilters,
    filterIndex,
    setActiveFilters,
    closePopover,
    localeStr,
  } = props;

  const filterValue = useMemo(
    () =>
      (activeFilters?.find(
        (filter) => filter.filterColumn === column.accessor && filter.filterIndex === filterIndex,
      )?.filterValue as string | number | boolean | undefined) ?? null,
    [activeFilters, column.accessor, filterIndex],
  );

  const selectedFilterOption = useMemo(
    () => column.filterOptions?.options?.find((option) => option.id === filterValue),
    [column.filterOptions?.options, filterValue],
  );

  const [localSelectedOption, setLocalSelectedOption] = useState<DynamicFilterOptions | null>(
    selectedFilterOption ?? null,
  );

  const handleApply = () => {
    const columnFilters =
      filterIndex ??
      (activeFilters.filter((filter) => filter.filterColumn === column.accessor)?.length || 0);
    updateFilters(
      localSelectedOption ? localSelectedOption.id : undefined,
      columnFilters,
      '',
      column,
      setActiveFilters,
    );
    closePopover?.();
  };

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid size={12}>
        <Autocomplete
          size="small"
          blurOnSelect
          clearOnBlur
          defaultValue={filterMode === 'single' ? selectedFilterOption : null}
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
          renderInput={(params) => <TextField {...params} label={column.label} />}
          aria-label="filter-select"
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
          {localeStr?.apply}
        </Button>
      </Grid>
    </Grid>
  );
}

/* ---------- Date Filter ---------- */

interface DateFilterFormProps<T> {
  column: DynamicColumns<T>;
  filterIndex?: number;
  activeFilters: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  closePopover: () => void;
  localeStr: i18nStrings['filters'];
}

export function DateFilterForm<T>(props: DateFilterFormProps<T>) {
  const { column, filterIndex, activeFilters, setActiveFilters, closePopover, localeStr } = props;

  const theme = useTheme();
  const firstDateComparators = ['dateMin', 'dateFrom', 'dateTo', 'exact'];

  const dateFilters = useMemo(
    () =>
      activeFilters.filter(
        (filter) => filter.filterColumn === column.accessor && filter.filterIndex === filterIndex,
      ),
    [activeFilters, column.accessor, filterIndex],
  );
  const minDate = dateFilters?.find((filter) =>
    firstDateComparators.includes(filter.filterComparator ?? ''),
  )?.filterValue as string;
  const maxDate = dateFilters?.find((filter) => filter.filterComparator === 'dateMax')
    ?.filterValue as string;
  const dateMinComparator = minDate
    ? firstDateComparators.find((comparator) =>
        dateFilters.find((filter) => filter.filterComparator === comparator),
      )
    : 'dateFrom';

  const currentSelectType = useMemo(() => {
    if (minDate && maxDate) return 'range';
    if (minDate) {
      if (dateMinComparator === 'dateFrom') return 'from';
      if (dateMinComparator === 'dateTo') return 'to';
      if (dateMinComparator === 'exact') return 'exact';
      return 'exact';
    }
    return 'exact';
  }, [minDate, maxDate, dateMinComparator]);

  const [selectType, setSelectType] = useState<'exact' | 'from' | 'to' | 'range'>(
    currentSelectType,
  );

  const [dateError, setDateError] = useState<boolean>(false);
  const [localDate, setValue] = useState<{ date_start: string; date_end: string }>({
    date_start: minDate ?? '',
    date_end: selectType === 'range' ? maxDate : '',
  });

  const updateFilterType = (event: SelectChangeEvent<'exact' | 'from' | 'to' | 'range'>) => {
    if (selectType !== 'range') {
      setValue((prevDate) => ({
        date_start: prevDate.date_start,
        date_end: '',
      }));
    }
    setSelectType(event.target.value as 'exact' | 'from' | 'to' | 'range');
  };

  const updateDateRange = (date: string, type: 'start' | 'end') => {
    setDateError(false);
    setValue((prevDate) => ({
      date_start: type === 'start' ? date : prevDate.date_start,
      date_end: type === 'end' ? date : prevDate.date_end,
    }));
  };

  const handleApply = useCallback(() => {
    const dateMinComparator =
      selectType === 'range'
        ? 'dateMin'
        : selectType === 'from'
        ? 'dateFrom'
        : selectType === 'to'
        ? 'dateTo'
        : 'exact';

    const dateMinFilters =
      filterIndex ??
      (activeFilters.filter((filter) => filter.filterComparator === 'dateMin').length || 0);
    const dateMaxFilters =
      filterIndex ??
      (activeFilters.filter((filter) => filter.filterComparator === 'dateMax').length || 0);

    // clear up previous date filters
    activeFilters
      .filter(
        (filter) => filter.filterColumn === column.accessor && filter.filterIndex === filterIndex,
      )
      .forEach((filter) => {
        setActiveFilters((prevFilters) =>
          prevFilters.filter((prevFilter) => prevFilter !== filter),
        );
      });

    if (selectType !== 'range') {
      updateFilters(
        localDate.date_start,
        dateMinFilters,
        dateMinComparator,
        column,
        setActiveFilters,
      );
    } else {
      updateFilters(localDate.date_start, dateMinFilters, 'dateMin', column, setActiveFilters);
      updateFilters(localDate.date_end, dateMaxFilters, 'dateMax', column, setActiveFilters);
    }

    closePopover?.();
  }, [selectType, localDate, activeFilters, column, filterIndex, setActiveFilters, closePopover]);

  const isApplyDisabled = useMemo(() => {
    if (selectType !== 'range') {
      return dateError;
    } else {
      return !localDate.date_start || !localDate.date_end || dateError;
    }
  }, [selectType, localDate.date_start, localDate.date_end, dateError]);

  return (
    <Grid container size={12} alignItems="center" gap={1}>
      {!column.filterOptions?.singleDate && (
        <Grid size={12}>
          <Select fullWidth value={selectType} onChange={updateFilterType} size="small">
            <MenuItem value="exact"> {localeStr?.exact} </MenuItem>
            <MenuItem value="from"> {localeStr?.dateFrom} </MenuItem>
            <MenuItem value="to"> {localeStr?.dateTo} </MenuItem>
            <MenuItem value="range"> {localeStr?.range} </MenuItem>
          </Select>
        </Grid>
      )}

      <Grid size={12}>
        <DatePicker
          label={selectType !== 'range' ? 'Data' : 'Data Inizio'}
          defaultValue={localDate.date_start ? dayjs(localDate.date_start) : null}
          onChange={(date, context) =>
            !context.validationError && date ? updateDateRange(date?.toISOString(), 'start') : null
          }
          maxDate={localDate.date_end ? dayjs(localDate.date_end).subtract(1, 'day') : undefined}
          onError={(error) => setDateError(Boolean(error))}
          slots={{
            openPickerIcon: CalendarFoldIcon,
          }}
          slotProps={{
            openPickerIcon: {
              color: theme.palette.action.active,
              size: 20,
            } as SvgIconProps & { size?: number },
            openPickerButton: {
              size: 'small',
            },
            textField: {
              size: 'small',
              fullWidth: true,
            },
          }}
        />
      </Grid>

      {selectType === 'range' && (
        <Grid size={12}>
          <DatePicker
            label="Data Fine"
            defaultValue={localDate.date_end ? dayjs(localDate.date_end) : null}
            onChange={(date, context) =>
              !context.validationError && date ? updateDateRange(date?.toISOString(), 'end') : null
            }
            minDate={localDate.date_start ? dayjs(localDate.date_start).add(1, 'day') : undefined}
            onError={(error) => setDateError(Boolean(error))}
            slots={{
              openPickerIcon: CalendarFoldIcon,
            }}
            slotProps={{
              openPickerIcon: {
                color: theme.palette.action.active,
                size: 20,
              } as SvgIconProps & { size?: number },
              openPickerButton: {
                size: 'small',
              },
              textField: {
                size: 'small',
                fullWidth: true,
              },
            }}
          />
        </Grid>
      )}

      <Grid size={12}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="small"
          onClick={handleApply}
          disabled={isApplyDisabled}
        >
          {localeStr?.apply}
        </Button>
      </Grid>
    </Grid>
  );
}

/* ---------- Multiple Date Filter ---------- */

interface MultipleDateFilterFormProps<T> {
  column: DynamicColumns<T>;
  filterMode: 'single' | 'multiple';
  filterIndex?: number;
  activeFilters: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  closePopover: () => void;
  localeStr: i18nStrings['filters'];
}

export function MultipleDateFilterForm<T>(props: MultipleDateFilterFormProps<T>) {
  const { column, filterMode, filterIndex, activeFilters, setActiveFilters, closePopover } = props;

  const dateFilters = useMemo(
    () =>
      activeFilters.filter(
        (filter) => filter.filterColumn === column.accessor && filter.filterIndex === filterIndex,
      ),
    [activeFilters, column.accessor, filterIndex],
  );
  const minDate = dateFilters?.find((filter) => filter.filterComparator === 'dateMin')
    ?.filterValue as string;
  const maxDate = dateFilters?.find((filter) => filter.filterComparator === 'dateMax')
    ?.filterValue as string;

  const [dateError, setDateError] = useState<boolean>(false);
  const [localDate, setValue] = useState<{ date_start: string; date_end: string }>({
    date_start: filterMode === 'single' ? minDate : '',
    date_end: filterMode === 'single' ? maxDate : '',
  });

  const updateDateRange = useCallback((date: string, type: 'start' | 'end') => {
    setDateError(false);
    setValue((prevDate) => ({
      date_start: type === 'start' ? date : prevDate.date_start,
      date_end: type === 'end' ? date : prevDate.date_end,
    }));
  }, []);

  const [filterType, setFilterType] = useState<'single' | 'range'>(
    minDate && maxDate ? 'range' : 'single',
  );
  const updateFilterType = useCallback(
    (event: SelectChangeEvent<'single' | 'range'>) => {
      if (filterType === 'single') {
        setValue((prevDate) => ({
          date_start: prevDate.date_start,
          date_end: '',
        }));
      }
      setFilterType(event.target.value as 'single' | 'range');
    },
    [filterType],
  );

  const handleApply = useCallback(() => {
    const dateMinFilters =
      filterIndex ??
      (activeFilters.filter((filter) => filter.filterComparator === 'dateMin').length || 0);
    const dateMaxFilters =
      filterIndex ??
      (activeFilters.filter((filter) => filter.filterComparator === 'dateMax').length || 0);

    if (filterType === 'single') {
      updateFilters(localDate.date_start, dateMinFilters, 'dateMin', column, setActiveFilters);
      if (localDate.date_end)
        updateFilters(undefined, dateMaxFilters, 'dateMax', column, setActiveFilters);
    } else {
      updateFilters(localDate.date_start, dateMinFilters, 'dateMin', column, setActiveFilters);
      updateFilters(localDate.date_end, dateMaxFilters, 'dateMax', column, setActiveFilters);
    }
    closePopover?.();
  }, [filterType, localDate, activeFilters, column, filterIndex, setActiveFilters, closePopover]);

  const isApplyDisabled = useMemo(() => {
    if (filterType === 'single') {
      return localDate.date_start === minDate || !localDate.date_start || dateError;
    } else {
      return !localDate.date_start || !localDate.date_end || dateError;
    }
  }, [filterType, localDate.date_start, localDate.date_end, minDate, dateError]);

  return (
    <Grid container size={12} alignItems="center" spacing={1}>
      <Grid size={12}>
        <Select fullWidth value={filterType} onChange={updateFilterType} size="small">
          <MenuItem value="single"> Data Singola </MenuItem>
          <MenuItem value="range"> Intervallo </MenuItem>
        </Select>
      </Grid>

      <Grid size={12}>
        <DatePicker
          label={filterType === 'single' ? 'Data' : 'Data Inizio'}
          defaultValue={localDate.date_start ? dayjs(localDate.date_start) : null}
          onChange={(date, context) =>
            !context.validationError && date ? updateDateRange(date?.toISOString(), 'start') : null
          }
          maxDate={localDate.date_end ? dayjs(localDate.date_end).subtract(1, 'day') : undefined}
          onError={(error) => setDateError(Boolean(error))}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
            },
          }}
        />
      </Grid>

      {filterType === 'range' && (
        <Grid size={12}>
          <DatePicker
            label="Data Fine"
            defaultValue={localDate.date_end ? dayjs(localDate.date_end) : null}
            onChange={(date, context) =>
              !context.validationError && date ? updateDateRange(date?.toISOString(), 'end') : null
            }
            minDate={localDate.date_start ? dayjs(localDate.date_start).add(1, 'day') : undefined}
            onError={(error) => setDateError(Boolean(error))}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
              },
            }}
          />
        </Grid>
      )}

      <Grid size={12}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="small"
          onClick={handleApply}
          disabled={isApplyDisabled}
        >
          Apply
        </Button>
      </Grid>
    </Grid>
  );
}
