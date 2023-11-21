/* tslint:disable */

import React from 'react';
import FilterModel from './model';
import TextField from '@mui/material/TextField';

export function StringFilter() {
  return new FilterModel<string, string>(
    'string',
    [
      {
        id: 'contains',
        label: 'Contiene',
        filter: (field, filterValue) => (field == null ? false : field.includes(filterValue)),
      },
      {
        id: 'not-contains',
        label: 'Non contiene',
        filter: (field, filterValue) => (field == null ? false : !field.includes(filterValue)),
      },
      {
        id: '=',
        label: 'È uguale',
        filter: (field, filterValue) => field === filterValue,
      },
      {
        id: '!=',
        label: 'È diverso',
        filter: (field, filterValue) => (field == null ? false : field !== filterValue),
      },
      {
        id: 'empty',
        label: 'È vuoto',
        filter: (field) => !field,
      },
    ],
    ({ value, onChange, condition, updateFilters, label, autoDelete }:any) => {
      const selectValue = React.useMemo(() => (typeof value !== 'string' ? '' : value), [value]);
      React.useEffect(() => {
        if (condition === 'empty' || (!!condition && selectValue !== '')) autoDelete(false);
        else autoDelete(true);
      }, [selectValue, condition]);
      return (
        <TextField
          label={label}
          fullWidth
          size="small"
          variant="outlined"
          value={selectValue}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onBlur={() => updateFilters()}
          disabled={condition === 'empty'}
        />
      );
    },
    { cond: 'contains', value: '', nullable: true }
  );
}
