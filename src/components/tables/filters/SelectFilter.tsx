/* tslint:disable */
import React from 'react';
import FilterModel from './model';
import { AutoSelect, AutoSelectOption } from '../../simple';

export function SelectFilter(options: string[] | AutoSelectOption[]) {
  return new FilterModel<string[], string>(
    'select',
    [
      {
        id: '=',
        label: 'È uguale',
        filter: (field, filterValue) => (field == null ? false : filterValue.some((fv) => fv === field)),
      },
      {
        id: '!=',
        label: 'È diverso',
        filter: (field, filterValue) => (field == null ? false : filterValue.every((fv) => fv !== field)),
      },
      {
        id: 'empty',
        label: 'È vuoto',
        filter: (field) => field == null,
      },
    ],
    ({ value, onChange, condition, updateFilters, label, autoDelete }:any) => {
      const selectValue = React.useMemo(() => (value == null ? [] : value), [value]);
      React.useEffect(() => {
        if (condition === 'empty' || (!!condition && selectValue.length !== 0)) autoDelete(false);
        else autoDelete(true);
        updateFilters();
      }, [selectValue, condition]);
      return (
        <AutoSelect
          title={label}
          options={options}
          value={selectValue}
          onChange={(id) => onChange(id)}
          autocompleteProps={{
            multiple: true,
            disableCloseOnSelect: true,
            blurOnSelect: false,
            limitTags: 1,
            size: 'small',
            disabled: condition === 'empty',
          }}
        />
      );
    },
    { cond: '=', value: [], nullable: true }
  );
}
