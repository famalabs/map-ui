/* tslint:disable */

import React from 'react';
import FilterModel from './model';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export function BooleanFilter() {
  return new FilterModel<boolean, boolean>(
    'boolean',
    [
      {
        id: '=',
        label: 'È uguale',
        filter: (field, filterValue) => (field == null ? false : field === !!filterValue),
      },
      {
        id: '!=',
        label: 'È diverso',
        filter: (field, filterValue) => (field == null ? false : field !== !!filterValue),
      },
      {
        id: 'empty',
        label: 'È vuoto',
        filter: (field) => field == null,
      },
    ],
    ({ value, onChange, condition, updateFilters, label, autoDelete }: any) => {
      const selectValue = React.useMemo(() => (typeof value !== 'boolean' ? '' : value ? 1 : 0), [value]);
      React.useEffect(() => {
        if (condition === 'empty' || (!!condition && selectValue !== '')) autoDelete(false);
        else autoDelete(true);
      }, [selectValue, condition]);
      return (
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel>{label}</InputLabel>
          <Select
            value={selectValue}
            onChange={(e) => {
              onChange(!!e.target.value);
              updateFilters();
            }}
            disabled={condition === 'empty'}
            label={label}
          >
            <MenuItem value={1}>Vero</MenuItem>
            <MenuItem value={0}>Falso</MenuItem>
          </Select>
        </FormControl>
      );
    },
    { cond: '=', value: true, nullable: false }
  );
}
