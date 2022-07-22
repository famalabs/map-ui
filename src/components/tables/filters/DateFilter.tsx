/* tslint:disable */

import React from 'react';
import FilterModel from './model';
import moment from 'moment';
import { DatePicker } from '../../pickers';
import { TextField } from '@mui/material';

export function DateFilter() {
  return new FilterModel<Date, Date | string>(
    'date',
    [
      {
        id: '=',
        label: 'È uguale',
        filter: (field, filterValue) => (field == null ? false : moment(field).isSame(filterValue, 'day'))
      },
      {
        id: '>',
        label: 'È dopo',
        filter: (field, filterValue) => (field == null ? false : moment(field).isAfter(filterValue, 'day'))
      },
      {
        id: '<',
        label: 'È prima',
        filter: (field, filterValue) => (field == null ? false : moment(field).isBefore(filterValue, 'day'))
      },
      {
        id: 'empty',
        label: 'È vuoto',
        filter: (field) => field == null
      }
    ],
    ({ value, onChange, condition, updateFilters, label, autoDelete }: any) => {
      React.useEffect(() => {
        if (condition === 'empty' || (!!condition && value != null)) autoDelete(false);
        else autoDelete(true);
        updateFilters();
      }, [value, condition]);
      return (
        <DatePicker
          value={value}
          onChange={(date: any) => onChange(date.toDate())}
          disablePast={false}
          label={label}
          renderInput={(params) => <TextField {...params} />}
        />
      );
    },
    { cond: '=', value: undefined, nullable: true }
  );
}
