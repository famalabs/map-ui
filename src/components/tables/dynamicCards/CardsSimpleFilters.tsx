import Autocomplete from '@mui/material/Autocomplete';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid2";
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { ActiveCardFilter, CardFilterDef } from './DynamicCardsTypes';
import qs from 'qs';

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
    <Grid mr={2} marginY={1}>
      <TextField
        fullWidth
        size='small'
        label={filtersDef.label}
        variant="outlined"
        onChange={(event) => updateFilters(event.target.value, filtersDef, setActiveFilters)}
        value={loadedValue ?? ''}
      />
    </Grid>
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
    <Grid minWidth={200} mr={2} marginY={1}>
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
    </Grid>
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
  onLoadQuery: string;
}

export function CardsSimpleFilters(props: CardsSimpleFiltersProps) {

  const { filtersDef, activeFilters, setActiveFilters, onLoadQuery } = props;

  /* Load filters from querystring */

  useEffect(() => {
    if (onLoadQuery) {
      const parsedObject = qs.parse(onLoadQuery, { ignoreQueryPrefix: true });
      const filterQuery = parsedObject.filter as Record<string, any>;

      const updatedActiveFilters = Object.entries(filterQuery).map(([filterName, filterValue]) => {

        const selectColumn = filtersDef.find(column => column.type === 'select' && column.accessor === filterName);

        switch (typeof selectColumn?.SelectCell?.[0].id) {
          case 'string':
            return { filterName, filterValue } as ActiveCardFilter;
          case 'number':
            return { filterName, filterValue: Number(filterValue) } as ActiveCardFilter;
          case 'boolean':
            return { filterName, filterValue: JSON.parse(filterValue.toLowerCase()) } as ActiveCardFilter;
          default:
            return { filterName, filterValue } as ActiveCardFilter;
        }

      });

      setActiveFilters(updatedActiveFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersDef]);

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

  if (filtersDef?.length === 0) return null;

  return (
    <Grid container>
      {filtersDef.map(filter => filterTypeMap(filter))}
    </Grid>
  );
}