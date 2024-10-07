import { FilterType, FilterValue } from 'react-table';

export default function filterTypes<T extends Record<string, any>>(
  given?: Record<string, FilterType<T>>
): Record<string, FilterType<T>> {
  return {
    custom: (rows, columnIds, filterValue) => rows,
    ...given,
  };
}
