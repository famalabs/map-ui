import Autocomplete from '@mui/material/Autocomplete';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { Dispatch, SetStateAction } from 'react';
import { ActiveFilter, DynColumnsDef } from './DynamicTypes';

/* ---------- String Filter ---------- */

interface StringFilterFormProps {
  column: DynColumnsDef;
  activeFilters?: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
}

export function StringFilterForm(props: StringFilterFormProps) {

  const { column, activeFilters, setActiveFilters } = props;

  const loadedValue = activeFilters?.find(filter => filter.filterColumn === column.accessor)?.filterValue ?? null;

  return (
    <Grid2 sm={'auto'} p={2}>
      <TextField
        fullWidth
        size='small'
        label={column.label}
        variant="outlined"
        onChange={(event) => updateFilters(event.target.value, column, setActiveFilters)}
        value={loadedValue ?? ''}
        aria-label='filter-text'
      />
    </Grid2>
  )
}

/* ---------- Select Filter ---------- */

interface SelectFilterFormProps {
  column: DynColumnsDef;
  activeFilters?: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
}

export function SelectFilterForm(props: SelectFilterFormProps) {

  const { column, activeFilters, setActiveFilters } = props;

  const loadedValue = activeFilters?.find(filter => filter.filterColumn === column.accessor)?.filterValue ?? null;
  const foundValue = column.SelectCell?.find(option => option.id === loadedValue);

  return (
    <Grid2 sm={'auto'} minWidth={200} p={2}>
      <Autocomplete
        fullWidth
        size='small'
        blurOnSelect
        clearOnBlur
        value={foundValue ?? null}
        onChange={(event, option) => updateFilters(option ? option.id : undefined, column, setActiveFilters)}
        options={column.SelectCell || []}
        getOptionLabel={(option) => option.label}
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
    </Grid2>
  );
}

/* ---------- Update Filters Function ---------- */

function updateFilters(
  value: string | number | boolean | undefined,
  column: DynColumnsDef,
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
      //filterType: column.type,
    } as ActiveFilter;

    if (filterIndex === -1) {
      return [...prevFilters, currentFilter];
    } else {
      return prevFilters.map((filter, index) => index === filterIndex ? currentFilter : filter);
    }

  });
}

/* Clear dynamic filters and then filter them on site */

/* ---------- Main Component ---------- */

export interface DynamicSimpleFiltersProps {
  columns: DynColumnsDef[];
  activeFilters: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
}

export function DynamicSimpleFilters(props: DynamicSimpleFiltersProps) {

  const { columns, activeFilters, setActiveFilters } = props;

  /* Renders row depending on its type */
  const filterTypeMap = (column: DynColumnsDef) => {
    switch (column.type) {

      case 'number':
        return null;

      case 'string':
        return <StringFilterForm
          key={column.accessor}
          column={column}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />;

      case 'select':
        return <SelectFilterForm
          key={column.accessor}
          column={column}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />;
    }
  }

  return (
    <Grid2
      container
      sm={8} md={8}
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
    >
      {columns.map(column => column.isFilter && filterTypeMap(column))}
    </Grid2>
  )
}