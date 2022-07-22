import React from 'react';
import { FilterType } from 'react-table';
import { AutoSelectOption } from '../../simple';

export type DataType = Exclude<any, undefined>;
export interface ConditionType<T, D> {
  id: string;
  label: string;
  filter: (field: D | null | undefined, filterValue: T) => boolean;
}

/**
 * FilterModel used for the different filters, depending on data-type
 */
export default class FilterModel<T, D> {
  readonly dataType: DataType;
  readonly tableFilter: FilterType<any>;
  readonly conditionsKeys: string[];
  readonly DisplayFilter: React.VFC<T>;
  readonly conditionsDict: { [id: string]: ConditionType<T, D> };
  readonly defaults: { cond?: string; value?: T; nullable?: boolean };

  constructor(
    type: DataType,
    conditions: ConditionType<T, D>[],
    display: React.VFC<T>,
    defaults: { cond?: string; value?: T; nullable?: boolean }
  ) {
    this.dataType = type;
    this.conditionsKeys = conditions.map((cond) => cond.id);
    this.conditionsDict = conditions.reduce<{ [id: string]: ConditionType<T, D> }>(
      (dict, cond) => ({ ...dict, [cond.id]: cond }),
      {}
    );
    this.DisplayFilter = display;
    this.defaults = defaults;
    this.tableFilter = (rows, [id], filterValue) => {
      return rows.filter((row) =>
        filterValue.every((f) =>
          f.cond ? this.conditionsDict[f.cond].filter(row.original[id], f.value) : true
        )
      );
    };
  }

  get conditionsMap(): AutoSelectOption[] {
    return this.conditionsKeys.map((id) => ({ id: id, label: this.conditionsDict[id].label }));
  }
}
