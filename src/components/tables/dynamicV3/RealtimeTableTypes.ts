import { ActiveFilter, DynamicTableProps, TableInfoProps } from "../dynamicV2";

export interface FetchDataResponse {
  nextCount: number;
  prevCount: number;
}

export interface RealtimeTableProps<T> extends Omit<DynamicTableProps<T>, 'fetchInfo'> {
  tableInfo: Omit<TableInfoProps<T>, 'staticMode'> & {
    savedVisibleColumns?: string[];
  };
  fetchInfo: {
    fetchData: (limit: number, filters: ActiveFilter[], direction?: 'left' | 'right' | 'reset') => Promise<FetchDataResponse>;
    fetchAllData?: (filters: ActiveFilter[]) => Promise<T[]>;
    isFetching: boolean;
  };
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onColumnsPopoverClose?: (visibleColumns: string[]) => Promise<void> | void;
}

