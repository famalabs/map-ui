import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid2";
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import 'dayjs/locale/en';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { ActiveFilter, DynamicFilterOptions, DynColumnsDef, i18nStrings } from './DynamicTypes';

/* ---------- Update Filters Function ---------- */

export function updateFilters<T>(
  value: unknown,
  index: number = 0,
  comparator: string,
  column: DynColumnsDef<T>,
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>,
) {
  setActiveFilters(prevFilters => {

    const filterIndex = prevFilters.findIndex(filter =>
      filter.filterColumn === column.accessor
      && filter.filterIndex === index
      && filter.filterComparator === comparator
      && filter.filterType === column.filterOptions?.type
    );

    if (value === null || value === undefined || value === '') {
      return prevFilters.filter(filter => filter.filterColumn !== column.accessor || filter.filterIndex !== index);
    }

    const currentFilter = {
      filterIndex: index,
      filterColumn: column.accessor,
      filterValue: value,
      filterType: column.filterOptions?.type,
      filterComparator: comparator,
    } as ActiveFilter;

    if (filterIndex === -1) {
      return [...prevFilters, currentFilter];
    } else {
      return prevFilters.map((filter, index) => index === filterIndex ? currentFilter : filter);
    }

  });
}

/* ---------- String Filter ---------- */

interface StringFilterFormProps<T> {
  column: DynColumnsDef<T>;
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

  const filterValue = useMemo(() =>
    activeFilters?.find(filter => filter.filterColumn === column.accessor && filter.filterIndex === filterIndex)?.filterValue ?? null
    , [activeFilters, column.accessor, filterIndex]);

  const [inputValue, setInputValue] = useState<string>(filterMode === 'single' ? filterValue?.toString() : '');

  useEffect(() => {
    if (aloneFilter) {
      setInputValue(filterValue?.toString() ?? '');
    }
  }, [filterValue, aloneFilter]);

  const handleApply = () => {
    const columnFilters = filterIndex ?? (activeFilters.filter(filter => filter.filterColumn === column.accessor)?.length || 0);
    updateFilters(inputValue, columnFilters, '', column, setActiveFilters);
    closePopover?.();
  };

  const isApplyDisabled = useMemo(() => inputValue === filterValue || !inputValue, [inputValue, filterValue]);

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
          value={aloneFilter ? (activeFilters[0]?.filterValue ?? '') : inputValue}
          onChange={aloneFilter
            ? (event) => updateFilters(event.target.value, 0, '', column, setActiveFilters)
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
                    ? () => setActiveFilters([])
                    : () => setInputValue('')
                  }
                  sx={{ 
                    visibility: aloneFilter 
                    ? (activeFilters.length ? 'visible' : 'hidden' )
                    : inputValue ? 'visible' : 'hidden'
                  }}
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
            disabled={isApplyDisabled}
            aria-label="apply-filter"
          >
            {localeStr.apply}
          </Button>
        </Grid>
      }
    </Grid>
  );
}

/* ---------- Number Filter ---------- */

interface NumberFilterFormProps<T> {
  column: DynColumnsDef<T>;
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

  const filterValue = useMemo(() =>
    activeFilters?.find(filter => filter.filterColumn === column.accessor && filter.filterIndex === filterIndex)?.filterValue ?? null
    , [activeFilters, column.accessor, filterIndex]);

  const [inputValue, setInputValue] = useState<number | null>(filterMode === 'single' ? Number(filterValue) : null);
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
  }
  
  useEffect(() => {
    if (aloneFilter) {
      setInputValue(Number(filterValue) || null);
    }
  }, [filterValue, aloneFilter]);

  const handleApply = () => {
    const columnFilters = filterIndex ?? (activeFilters.filter(filter => filter.filterColumn === column.accessor)?.length ?? null);
    updateFilters(inputValue, columnFilters, '', column, setActiveFilters);
    closePopover?.();
  };

  const isApplyDisabled = useMemo(() => inputValue === filterValue || (inputValue === null || inputValue === undefined), [inputValue, filterValue]);

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
          type="number"
          label={!aloneFilter ? column.label : ''}
          placeholder={aloneFilter ? column.label : ''}
          variant="outlined"
          value={aloneFilter ? (activeFilters[0]?.filterValue ?? null) : inputValue}
          onChange={handleInputChange}
          aria-label="filter-number"
          slotProps={{
            input: {
              type: 'number',
              startAdornment: aloneFilter && (
                <SearchIcon sx={{ marginRight: '.4rem' }} />
              ),
              endAdornment: filterValue ? (
                <IconButton
                  size="small"
                  onClick={aloneFilter
                    ? () => setActiveFilters([])
                    : () => setInputValue(null)
                  }
                  sx={{
                    visibility: aloneFilter
                      ? (activeFilters.length ? 'visible' : 'hidden')
                      : inputValue ? 'visible' : 'hidden'
                  }}
                  aria-label="clear-filter"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : null,
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
            disabled={isApplyDisabled}
            aria-label="apply-filter"
          >
            {localeStr.apply}
          </Button>
        </Grid>
      }
    </Grid>
  );
}

/* ---------- Select Filter ---------- */

interface SelectFilterFormProps<T> {
  column: DynColumnsDef<T>;
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

  const filterValue = useMemo(() => activeFilters?.find(filter =>
    filter.filterColumn === column.accessor && filter.filterIndex === filterIndex)?.filterValue ?? null
    , [activeFilters, column.accessor, filterIndex]);
  const selectedFilterOption = useMemo(() => column.filterOptions?.options?.find(option => option.id === filterValue), [column.filterOptions?.options, filterValue]);

  const [localSelectedOption, setLocalSelectedOption] = useState<DynamicFilterOptions | null>(
    selectedFilterOption ?? null
  );

  const handleApply = () => {
    const columnFilters = filterIndex ?? (activeFilters.filter(filter => filter.filterColumn === column.accessor)?.length || 0);
    updateFilters(
      localSelectedOption ? localSelectedOption.id : undefined,
      columnFilters,
      '',
      column,
      setActiveFilters
    );
    closePopover?.();
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
          {localeStr.apply}
        </Button>
      </Grid>
    </Grid>
  );
}

/* ---------- Date Filter ---------- */

interface DateFilterFormProps<T> {
  column: DynColumnsDef<T>;
  filterIndex?: number;
  activeFilters: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
  closePopover: () => void;
  localeStr: i18nStrings['filters'];
}

export function DateFilterForm<T>(props: DateFilterFormProps<T>) {

  const {
    column,
    filterIndex,
    activeFilters,
    setActiveFilters,
    closePopover,
    localeStr,
  } = props;


  const dateValue = useMemo(() =>
    activeFilters?.find(filter => filter.filterColumn === column.accessor && filter.filterIndex === filterIndex)?.filterValue as string ?? null
    , [activeFilters, column.accessor, filterIndex]);

  const [dateError, setDateError] = useState<boolean>(false);
  const [localDate, setValue] = useState<string>(dateValue ?? '');

  const updateDateRange = (date: string) => {
    console.log(date);
    setDateError(false);
    setValue(date);
  }

  const [selectType, setSelectType] = useState<'from' | 'to'>('from');
  const updateFilterType = (event: SelectChangeEvent<"from" | "to">) => {
    setSelectType(event.target.value as 'from' | 'to');
  }

  const handleApply = () => {
    const dateFilters = filterIndex ?? (activeFilters.filter(filter => filter.filterColumn === column.accessor)?.length || 0);
    updateFilters(localDate, dateFilters, selectType, column, setActiveFilters);
    closePopover?.();
  };

  const isApplyDisabled = useMemo(() => localDate === dateValue || dateError || !localDate, [localDate, dateValue, dateError]);

  return (
    <Grid
      container
      size={12}
      alignItems="center"
      gap={1}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={localeStr.dateLanguage}>
        <Grid size={12}>
          <Select
            fullWidth
            value={selectType}
            onChange={updateFilterType}
            size='small'
          >
            <MenuItem value='from' > {localeStr.dateFrom} </MenuItem>
            <MenuItem value='to'> {localeStr.dateTo} </MenuItem>
          </Select>
        </Grid>

        <Grid size={12}>
          <DatePicker
            label={localeStr.date}
            defaultValue={localDate ? dayjs(localDate) : null}
            onChange={(date, context) => !context.validationError ? updateDateRange(date?.toISOString()) : null}
            onError={(error) => setDateError(Boolean(error))}
            format='DD/MM/YYYY'
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
              }
            }}
          />
        </Grid>
        <Grid size={12}>
          <Button
            fullWidth
            variant='contained'
            color='primary'
            size='small'
            onClick={handleApply}
            disabled={isApplyDisabled}
          >
            {localeStr.apply}
          </Button>
        </Grid>
      </LocalizationProvider>
    </Grid>
  );
}

/* ---------- Multiple Date Filter ---------- */

// interface MultipleDateFilterFormProps<T> {
//   column: DynColumnsDef<T>;
//   filterMode: 'single' | 'multiple';
//   filterIndex?: number;
//   activeFilters: ActiveFilter[];
//   setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
//   closePopover: () => void;
// }

// export function MultipleDateFilterForm<T>(props: MultipleDateFilterFormProps<T>) {

//   const {
//     column,
//     filterMode,
//     filterIndex,
//     activeFilters,
//     setActiveFilters,
//     closePopover,
//   } = props;


//   const dateFilters = useMemo(() => activeFilters.filter(filter => filter.filterColumn === column.accessor && filter.filterIndex === filterIndex), [activeFilters, column.accessor, filterIndex]);
//   const minDate = dateFilters?.find(filter => filter.filterComparator === 'dateMin')?.filterValue as string;
//   const maxDate = dateFilters?.find(filter => filter.filterComparator === 'dateMax')?.filterValue as string;

//   const [dateError, setDateError] = useState<boolean>(false);
//   const [localDate, setValue] = useState<{ date_start: string, date_end: string }>({
//     date_start: filterMode === 'single' ? minDate : '',
//     date_end: filterMode === 'single' ? maxDate : '',
//   });

//   const updateDateRange = (date: string, type: 'start' | 'end') => {
//     setDateError(false);
//     console.log(date);
//     setValue(prevDate => ({
//       date_start: type === 'start' ? date : prevDate.date_start,
//       date_end: type === 'end' ? date : prevDate.date_end
//     }));
//   }

//   const [filterType, setFilterType] = useState<'single' | 'range'>(minDate && maxDate ? 'range' : 'single');
//   const updateFilterType = (event: SelectChangeEvent<"single" | "range">) => {
//     if (filterType === 'single') {
//       setValue(prevDate => ({
//         date_start: prevDate.date_start,
//         date_end: '',
//       }));
//     }
//     setFilterType(event.target.value as 'single' | 'range');
//   }

//   const handleApply = () => {

//     const dateMinFilters = filterIndex ?? (activeFilters.filter(filter => filter.filterComparator === 'dateMin').length || 0);
//     const dateMaxFilters = filterIndex ?? (activeFilters.filter(filter => filter.filterComparator === 'dateMax').length || 0);

//     if (filterType === 'single') {
//       console.log('Updating filter: ', dateMinFilters, dateMaxFilters);
//       updateFilters(localDate.date_start, dateMinFilters, 'dateMin', column, setActiveFilters);
//       if (localDate.date_end) updateFilters(undefined, dateMaxFilters, 'dateMax', column, setActiveFilters);
//     } else {
//       console.log('Updating filters: ', dateMinFilters, dateMaxFilters);
//       updateFilters(localDate.date_start, dateMinFilters, 'dateMin', column, setActiveFilters);
//       updateFilters(localDate.date_end, dateMaxFilters, 'dateMax', column, setActiveFilters);
//     }
//     closePopover?.();
//   };

//   const isApplyDisabled = useMemo(() => {
//     if (filterType === 'single') {
//       return localDate.date_start === minDate || !localDate.date_start || dateError;
//     } else {
//       return !localDate.date_start || !localDate.date_end || dateError;
//     }
//   }, [filterType, localDate.date_start, localDate.date_end, minDate, dateError]);

//   return (
//     <Grid
//       container
//       size={12}
//       alignItems="center"
//       gap={1}
//     >
//       <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
//         <Grid size={12}>
//           <Select
//             fullWidth
//             value={filterType}
//             onChange={updateFilterType}
//             size='small'
//           >
//             <MenuItem value='single' > Data Singola </MenuItem>
//             <MenuItem value='range'> Intervallo </MenuItem>
//           </Select>
//         </Grid>

//         <Grid size={12}>
//           <DatePicker
//             label={filterType === 'single' ? 'Data' : 'Data Inizio'}
//             defaultValue={localDate.date_start ? dayjs(localDate.date_start) : null}
//             onChange={(date, context) => !context.validationError ? updateDateRange(date?.toISOString(), 'start') : null}
//             maxDate={localDate.date_end ? dayjs(localDate.date_end).subtract(1, 'day') : undefined}
//             onError={(error) => setDateError(Boolean(error))}
//             slotProps={{
//               textField: {
//                 size: 'small',
//                 fullWidth: true,
//               }
//             }}
//           />
//         </Grid>
//         {filterType === 'range' &&
//           <Grid size={12}>
//             <DatePicker
//               label="Data Fine"
//               defaultValue={localDate.date_end ? dayjs(localDate.date_end) : null}
//               onChange={(date, context) => !context.validationError ? updateDateRange(date?.toISOString(), 'end') : null}
//               minDate={localDate.date_start ? dayjs(localDate.date_start).add(1, 'day') : undefined}
//               onError={(error) => setDateError(Boolean(error))}
//               slotProps={{
//                 textField: {
//                   size: 'small',
//                   fullWidth: true,
//                 }
//               }}
//             />
//           </Grid>
//         }
//         <Grid size={12}>
//           <Button
//             fullWidth
//             variant='contained'
//             color='primary'
//             size='small'
//             onClick={handleApply}
//             disabled={isApplyDisabled}
//           >
//             Apply
//           </Button>
//         </Grid>
//       </LocalizationProvider>
//     </Grid>
//   );
// }