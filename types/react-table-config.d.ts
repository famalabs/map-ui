import {
  FilterType,
  UseColumnOrderInstanceProps,
  UseColumnOrderState,
  UseExpandedHooks,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseExpandedRowProps,
  UseExpandedState,
  UseFiltersColumnOptions,
  UseFiltersColumnProps,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  UseFiltersState,
  UseGlobalFiltersColumnOptions,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersOptions,
  UseGlobalFiltersState,
  UseGroupByCellProps,
  UseGroupByColumnOptions,
  UseGroupByColumnProps,
  UseGroupByHooks,
  UseGroupByInstanceProps,
  UseGroupByOptions,
  UseGroupByRowProps,
  UseGroupByState,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseResizeColumnsColumnOptions,
  UseResizeColumnsColumnProps,
  UseResizeColumnsOptions,
  UseResizeColumnsState,
  UseRowSelectHooks,
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectRowProps,
  UseRowSelectState,
  UseRowStateCellProps,
  UseRowStateInstanceProps,
  UseRowStateOptions,
  UseRowStateRowProps,
  UseRowStateState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByHooks,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
} from 'react-table';
import React from 'react';
import { ConditionType } from '../components/tables/filters/model';
import { AutoSelectOption } from '../components/simple';

//type ColumnType = 'boolean' | 'number' | 'date' | 'string' | 'select' | undefined;

declare module 'react-table' {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration

  export interface TableOptions<D extends Record<string, unknown>> //UseExpandedOptions<D>,
    extends UseFiltersOptions<D>,
      UseGlobalFiltersOptions<D>,
      //UseGroupByOptions<D>,
      UsePaginationOptions<D>,
      //UseResizeColumnsOptions<D>,
      UseRowSelectOptions<D>,
      //UseRowStateOptions<D>,
      UseSortByOptions<D> {
    // note that having Record here allows you to add anything to the options, this matches the spirit of the
    // underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
    // feature set, this is a safe default.
    //Record<string, any>
  }

  export interface Hooks<D extends Record<string, unknown> = Record<string, unknown>> //UseExpandedHooks<D>,
    //UseGroupByHooks<D>,
    extends UseRowSelectHooks<D>,
      UseSortByHooks<D> {}

  export interface TableInstance<D extends Record<string, unknown> = Record<string, unknown>> //UseColumnOrderInstanceProps<D>,
    //UseExpandedInstanceProps<D>,
    extends UseFiltersInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      //UseGroupByInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      //UseRowStateInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<D extends Record<string, unknown> = Record<string, unknown>> //UseColumnOrderState<D>,
    //UseExpandedState<D>,
    extends UseFiltersState<D>,
      UseGlobalFiltersState<D>,
      //UseGroupByState<D>,
      UsePaginationState<D>,
      //UseResizeColumnsState<D>,
      UseRowSelectState<D>,
      //UseRowStateState<D>,
      UseSortByState<D> {}

  export interface ColumnInterface<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseFiltersColumnOptions<D>,
      UseGlobalFiltersColumnOptions<D>,
      //UseGroupByColumnOptions<D>,
      //UseResizeColumnsColumnOptions<D>,
      UseSortByColumnOptions<D> {
    name?: string;
    type?: ColumnType;
    filterModel?: FilterModel<any>;
  }

  export interface ColumnInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseFiltersColumnProps<D>,
      //UseGroupByColumnProps<D>,
      //UseResizeColumnsColumnProps<D>,
      UseSortByColumnProps<D> {
    name?: string;
    type?: ColumnType;
    filterModel?: FilterModel<any>;
  }

  export interface Cell<D extends Record<string, unknown> = Record<string, unknown>, V = any> {
    /*extends UseGroupByCellProps<D>,
            UseRowStateCellProps<D>*/
  }

  export interface Row<D extends Record<string, unknown> = Record<string, unknown>> //UseExpandedRowProps<D>,
    //UseGroupByRowProps<D>,
    extends UseRowSelectRowProps<D> {
    //UseRowStateRowProps<D>
  }

  export type ColumnType = 'boolean' | 'number' | 'date' | 'string' | 'select' | undefined;
  export interface DisplayFilterProps<T> {
    value?: T;
    onChange: (value: T) => void;
    condition?: string;
    label?: string;
    updateFilters: () => void;
    autoDelete: (nullable: boolean) => void;
  }
  export interface FilterModel<T, D> {
    readonly tableFilter: FilterType<any>;
    readonly conditionsKeys: string[];
    readonly conditionsDict: { [id: string]: ConditionType<T, D> };
    readonly DisplayFilter: React.VFC<DisplayFilterProps<T>>;
    readonly defaults: { cond?: string; value?: T; nullable?: boolean };
    readonly conditionsMap: AutoSelectOption[];
  }
}
