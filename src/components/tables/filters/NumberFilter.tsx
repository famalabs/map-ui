/* tslint:disable */
import React from 'react';
import FilterModel from './model';
import { TextField } from '@mui/material';

export function NumberFilter() {
  return new FilterModel<number, number | bigint>(
    'number',
    [
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
        id: '>',
        label: 'È maggiore',
        filter: (field, filterValue) => (field == null ? false : field > filterValue),
      },
      {
        id: '>=',
        label: 'È maggiore o uguale',
        filter: (field, filterValue) => (field == null ? false : field >= filterValue),
      },
      {
        id: '<',
        label: 'È minore',
        filter: (field, filterValue) => (field == null ? false : field < filterValue),
      },
      {
        id: '<=',
        label: 'È minore o uguale',
        filter: (field, filterValue) => (field == null ? false : field <= filterValue),
      },
      {
        id: 'empty',
        label: 'È vuoto',
        filter: (field) => field == null,
      },
    ],
    ({ value, onChange, condition, updateFilters, label, autoDelete }:any) => {
      const selectValue = React.useMemo(() => (typeof value !== 'number' ? '' : value), [value]);
      React.useEffect(() => {
        if (condition === 'empty' || (!!condition && selectValue !== '')) autoDelete(false);
        else autoDelete(true);
      }, [selectValue, condition]);
      return (
        <TextField
          label={label}
          type="number"
          fullWidth
          size="small"
          variant="outlined"
          value={selectValue}
          onChange={(e) => {
            onChange(e.target.value ? Number(e.target.value) : null);
          }}
          onBlur={() => updateFilters()}
          disabled={condition === 'empty'}
        />
      );
    },
    { cond: '=', value: null, nullable: true }
  );
}
