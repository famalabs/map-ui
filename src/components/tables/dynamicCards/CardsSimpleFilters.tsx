import Autocomplete from '@mui/material/Autocomplete';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { Dispatch, SetStateAction } from 'react';
import { ActiveCardFilter, CardFilterDef } from './DynamicCardsTypes';

/* ---------- String Filter ---------- */

interface StringFilterFormProps {
  filtersDef: CardFilterDef;
  activeFilters?: ActiveCardFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveCardFilter[]>>;
}

function StringFilterForm(props: StringFilterFormProps) {

  const { filtersDef, activeFilters, setActiveFilters } = props;

  const loadedValue = activeFilters?.find(filter => filter.filterName === filtersDef.accessor)?.filterValue ?? null;

  return (
    <Grid2 mr={2} marginY={1}>
      <TextField
        fullWidth
        size='small'
        label={filtersDef.label}
        variant="outlined"
        onChange={(event) => updateFilters(event.target.value, filtersDef, setActiveFilters)}
        value={loadedValue ?? ''}
      />
    </Grid2>
  )
}

/* ---------- Select Filter ---------- */

interface SelectFilterFormProps {
  filtersDef: CardFilterDef;
  activeFilters?: ActiveCardFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveCardFilter[]>>;
}

function SelectFilterForm(props: SelectFilterFormProps) {

  const { filtersDef, activeFilters, setActiveFilters } = props;

  const loadedValue = activeFilters?.find(filter => filter.filterName === filtersDef.accessor)?.filterValue ?? null;
  const foundValue = filtersDef.SelectCell?.find(option => option.id === loadedValue);

  return (
    <Grid2 minWidth={200} mr={2} marginY={1}>
      <Autocomplete
        fullWidth
        size='small'
        blurOnSelect
        clearOnBlur
        value={foundValue ?? null}
        onChange={(event, option) => updateFilters(option ? option.id : undefined, filtersDef, setActiveFilters)}
        options={filtersDef.SelectCell || []}
        getOptionLabel={(option) => option.label}
        renderOption={(props, option) => <ListItem {...props}>{option.label}</ListItem>}
        renderInput={
          (params) => (
            <TextField
              {...params}
              label={filtersDef.label}
            />)
        }
      />
    </Grid2>
  );
}

/* ---------- Update Filters Function ---------- */

function updateFilters(
  value: string | number | boolean | undefined,
  column: CardFilterDef,
  setActiveFilters: Dispatch<SetStateAction<ActiveCardFilter[]>>,
) {
  setActiveFilters(prevFilters => {

    const filterIndex = prevFilters.findIndex(filter => filter.filterName === column.accessor);

    if (value === undefined || value === '') {
      return prevFilters.filter((filter, index) => index !== filterIndex);
    }

    const currentFilter = {
      filterName: column.accessor,
      filterValue: value,
      //filterType: column.type,
    } as ActiveCardFilter;

    if (filterIndex === -1) {
      return [...prevFilters, currentFilter];
    } else {
      return prevFilters.map((filter, index) => index === filterIndex ? currentFilter : filter);
    }

  });
}

/* ---------- Main Component ---------- */

export interface CardsSimpleFiltersProps {
  filtersDef: CardFilterDef[];
  activeFilters: ActiveCardFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveCardFilter[]>>;
}

export function CardsSimpleFilters(props: CardsSimpleFiltersProps) {

  const { filtersDef, activeFilters, setActiveFilters } = props;

  /* Renders row depending on its type */
  const filterTypeMap = (filter: CardFilterDef) => {
    switch (filter.type) {

      case 'number':
        return null;

      case 'string':
        return <StringFilterForm
          filtersDef={filter}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />;

      case 'select':
        return <SelectFilterForm
          filtersDef={filter}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />;
    }
  }

  return (
    <Grid2
      container
      md={12}
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      p={2} pl={0}
    >
      {filtersDef.map(filter => filterTypeMap(filter))}
    </Grid2>
  )
}