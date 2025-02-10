import { ButtonOwnProps, IconButtonOwnProps } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

/**
 * Interface for the options of a select cell.
 * @param {string} id - The ID of the option.
 * @param {string} label - The label of the option.
 */
export interface DynamicFilterOptions {
  id: string | number | boolean;
  label: string;
}

export type ColumnType = 'string'
  | 'number' | 'action' | 'avatar'
  | 'boolean' | 'date' | 'image'
  | 'link' | 'status' | 'select';

/**
 * Interface for the definition of a dynamic column.
 * @param {string} accessor - The accessor of the column.
 * @param {string} label - The label of the column.
 * @param {DynamicFilterOptions[]} filterOptions - The options for the filter in case of select.
 * @param {(props: { cellValue: string, currentColumn?: DynColumnsDef<T>, currentRow?: T }) => JSX.Element} Cell - The custom cell component.
 * @param {{ icon: JSX.Element, action: (currentColumn?: DynColumnsDef<T>) => void }} Tooltip - The tooltip component.
 * @param {boolean} visible - Indicates whether the column is visible.
 */
export interface DynColumnsDef<T> {
  accessor: string;
  label: string;
  filterOptions?: { type: FilterType, options?: DynamicFilterOptions[], priority?: boolean }
  ColumnCell?: () => JSX.Element;
  Cell?: (props: { cellValue: string, currentColumn?: DynColumnsDef<T>, currentRow?: T }) => JSX.Element;
  Tooltip?: { icon?: JSX.Element, color?: IconButtonOwnProps['color'], label: string }
  visible: boolean;
}

/**
 * Type for the filter type.
 */
export type FilterType = 'string' | 'number' | 'select' | 'date';

/**
 * Type for the filter value.
 */
export type FilterValue = unknown;

/**
 * Interface for an active filter.
 * @param {string} filterColumn - The column of the filter.
 * @param {FilterValue} filterValue - The value of the filter.
 * @param {FilterType} filterType - The type of the filter.
 */
export interface ActiveFilter {
  filterIndex: number;
  filterColumn: string;
  filterValue?: FilterValue;
  filterType?: FilterType;
  filterComparator?: string;
}

/**
 * Type for the action event.
 */
export type ActionEvent<T extends Record<string, any>> = (actionType: string, selectedRows: T[], activeFilters: ActiveFilter[]) => void;

/**
 * Interface for an action event button.
 * Only one of label or icon is required. Both can be provided.
 * @param {ActionType} type - The type of the action.
 * @param {string} label - Optional label of the button.
 * @param {ButtonOwnProps['color']} color - Optional color of the button.
 * @param {JSX.Element} icon - Optional icon of the button.
 * @param {boolean} isIconButton - Indicates whether the button is an icon button.
 */
export interface ActionEventItem {
  type: string;
  label?: string;
  color?: ButtonOwnProps['color'];
  icon?: JSX.Element;
  isIconButton?: boolean;
  refetch?: boolean;
}

/* --------------------------------------------------------------------------------------------------------------------- */

/**
 * Interface for the props accepted by the TableInfo prop.
 * @param {string} tableName - The name of the table.
 * @param {Array<T>} tableData - The data of the table.
 * @param {Dispatch<SetStateAction<T[]>>} setTableData - The function to set the table data.
 * @param {DynColumnsDef[]} columns - The columns of the table.
 * @param {number} expectedRowCount - The expected row count.
 * @param {boolean} static - Indicates whether the table is static.
 * @param {boolean} showVisibleColumnsButton - Indicates whether the visible columns button is shown.
 * @param {string} emptyTablePlaceholderSrc - The source of the empty table placeholder.
 * @param {string} emptyTablePlaceholderText - The text of the empty table placeholder.
 * @param {Object} paginationOptions - The options for the pagination.
 */
export interface TableInfoProps<T> {
  tableName: string;
  tableData: Array<T>;
  setTableData?: Dispatch<SetStateAction<T[]>>;
  columns: DynColumnsDef<T>[];
  expectedRowCount: number;
  variant?: 'standard' | 'dense' | 'compact';
  filterMode?: 'single' | 'multiple';
  staticMode?: boolean;
  showVisibleColumnsButton?: boolean;
  emptyTablePlaceholderSrc?: string;
  emptyTablePlaceholderText?: string;
  paginationOptions?: {
    customPageRowCount?: number;
    customSelectPages?: number[];
    autoSizeHeight?: boolean;
    hideFooter?: boolean;
  },
}

/**
  * Interface for the props accepted by the FetchInfo prop.
  * @param {(limit: number, filters: ActiveFilter[], firstLoad?: boolean) => Promise<void>} fetchData - The function to fetch data.
  * @param {boolean} isFetching - Indicates whether the data is being fetched.
 */
export interface FetchInfoProps {
  fetchData: (limit: number, filters: ActiveFilter[], firstLoad?: boolean) => Promise<void>;
  isFetching: boolean;
  prefetchNextPage?: boolean;
}

/**
  * Interface for the props accepted by the QueryInfo prop.
  * @param {string} onLoadQuery - The query to be loaded.
  * @param {Dispatch<SetStateAction<string>>} setCurrentQuery - The function to set the current query.
 */
export interface QueryInfoProps {
  onLoadQuery: ActiveFilter[] | string;
  setCurrentQuery: Dispatch<SetStateAction<string>>;
}

/**
  * Interface for the props accepted by the DefineActions prop.
  * @param {ActionEventItem[]} actionList - The list of actions.
  * @param {ActionEvent<Record<string, any>>} onAction - The function to be called when an action is clicked.
 */
export interface DefineActionsProps<T extends Record<string, any>> {
  actionList: ActionEventItem[];
  onAction: ActionEvent<T>;
}

/**
  * Interface for the props accepted by the i18nStrings prop.
  * @param {string} quickActions - The string for the quick actions.
  * @param {string} visibleColumns - The string for the visible columns.
  * @param {string} itemsSelected - The string for the items selected.
  * @param {string} rowsPerPage - The string for the rows per page.
  * @param {string} of - The string for the of.
 */
export interface i18nStrings {
  header?: {
    quickActions: string,
    visibleColumns: string,
    itemsSelected: string,
  }
  filters?: {
    addFilter: string,
    removeFilter: string,
    filterBy: string,
    moreFilters: string,
    date: string,
    dateFrom: string,
    dateTo: string,
    dateLanguage: string;
    apply: string,
    clear: string,
  }
  footer?: {
    rowsPerPage: string,
    of: string,
  }
}

/**
 * Interface for the newItemButton.
 * @param {string} label - The label of the button.
 * @param {JSX.Element} icon - Optional icon of the button.
 * @param {() => void} buttonClick - Function to be called when the button is clicked.
 */
export interface CustomButton {
  label: string;
  icon?: JSX.Element;
  buttonClick: () => void;
}

/**
 * Interface for the props accepted by the DynamicTable component.
  * @param {TableInfoProps} tableInfo - The general props of the table.
  * @param {FetchInfoProps} fetchInfo - The props for fetching data.
  * @param {QueryInfoProps} queryInfo - The props for the searchParam query.
  * @param {() => void} onRowClick - Function to be called when a row is clicked.
  * @param {DefineActionsProps} defineActions - The props for the actions.
  * @param {CustomButton} newItemButton - The props for the new item button.
  * @param {'en' | 'it'} tableLocale - The default locale of the table.
  * @param {i18nStrings} localeStr - The props for custom locale strings.
  * 
 */
export interface DynamicTableProps<T extends Record<string, any>> {
  tableInfo: TableInfoProps<T>;
  fetchInfo: FetchInfoProps;
  queryInfo?: QueryInfoProps;
  onRowClick?: (row: T) => void;
  defineActions?: DefineActionsProps<T>
  newItemButton?: CustomButton;
  paperVariant?: 'elevation' | 'outlined';
  tableLocale?: 'en' | 'it';
  localeStr?: i18nStrings;
}