/* tslint:disable */

import React from 'react';
import FilterModel from './model';
import moment from 'moment';
import { DatePicker } from '../../pickers';

export function DateFilter() {
  return new FilterModel<Date, Date | string>(
    'date',
    [
      {
        id: '=',
        label: 'È uguale',
        filter: (field, filterValue) => (field == null ? false : moment(field)?.isSame(filterValue, 'day'))
      },
      {
        id: '>',
        label: 'È dopo',
        filter: (field, filterValue) => (field == null ? false : moment(field)?.isAfter(filterValue, 'day'))
      },
      {
        id: '<',
        label: 'È prima',
        filter: (field, filterValue) => { console.log(field, moment(field)); return(field == null ? false : moment(field)?.isBefore(filterValue, 'day'))}
      },
      {
        id: 'empty',
        label: 'È vuoto',
        filter: (field) => field == null
      }
    ],
    ({ value, onChange, condition, updateFilters, label, autoDelete }: any) => {
      console.log("filter", value, condition);

      React.useEffect(() => {

        if (condition === 'empty' || (!!condition && value != null)) autoDelete(false);
        else autoDelete(true);
        updateFilters();
      }, [value, condition]);
      return (
        <DatePicker
          value={moment(value)}
          onChange={(date: any) => onChange(date.toDate())}
          disablePast={false}
          label={label}
        />
      );
    },
    { cond: '=', value: undefined, nullable: true }
  );
}
