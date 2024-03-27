import { ButtonOwnProps, ChipOwnProps } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

/**
 * Interface for the options of a select cell.
 * @param {string} id - The ID of the option.
 * @param {string} type - The type of the option.
 * @param {string} label - The label of the option.
 */
export interface NewSelectCellOption {
  id: string | number | boolean;
  type: ChipOwnProps['color'];
  label: string;
}

/**
 * Interface for the definition of a dynamic column.
 * @param {string} accessor - The accessor of the column.
 * @param {string} label - The label of the column.
 * @param {string} type - The type of the column.
 * @param {boolean} isFilter - Indicates whether the column is filterable.
 * @param {boolean} visible - Indicates whether the column is visible.
 * @param {JSX.Element} Cell - The cell component for the column.
 * @param {NewSelectCellOption[]} SelectCell - The options for the select cell.
 */
export interface DynColumnsDef {
  accessor: string;
  label: string;
  type: string;
  isFilter?: boolean;
  visible: boolean;
  Cell?: JSX.Element;
  SelectCell?: NewSelectCellOption[];
}

/**
 * Type for the filter type.
 */
export type FilterType = 'string' | 'number' | 'select';

/**
 * Type for the filter value.
 */
export type FilterValue = string | number | boolean | undefined;

/**
 * Interface for an active filter.
 * @param {string} filterColumn - The column of the filter.
 * @param {FilterValue} filterValue - The value of the filter.
 * @param {FilterType} filterType - The type of the filter.
 */
export interface ActiveFilter {
  filterColumn: string;
  filterValue: FilterValue;
  filterType?: FilterType;
}

/**
 * Type for the action type.
 */
export type ActionType = 'delete' | 'import' | 'export';

/**
 * Type for the action event.
 */
export type ActionEvent<T extends Record<string, any>> = (action: ActionType, selectedRows: T[]) => void;

/**
 * Interface for an action event button.
 * Only one of label or icon is required. Both can be provided.
 * @param {ActionType} type - The type of the action.
 * @param {string} label - Optional label of the button.
 * @param {JSX.Element} icon - Optional icon of the button.
 * @param {boolean} isIconButton - Indicates whether the button is an icon button.
 */
export interface ActionEventItem {
  type: ActionType;
  label?: string;
  color?: ButtonOwnProps['color'];
  icon?: JSX.Element;
  isIconButton?: boolean;
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
 * @param {string} tableName - The name of the table (required for localStorage).
 * @param {Object} tableInfo - Contains information about the table.
 * @param {Array<T>} tableInfo.tableData - The data to be displayed in the table.
 * @param {Dispatch<SetStateAction<T[]>>} tableInfo.setTableData - Function to update the table data.
 * @param {DynColumnsDef[]} tableInfo.columns - Definitions for the columns of the table.
 * @param {number} tableInfo.expectedRowCount - The expected number of rows in the table.
 * @param {Object} fetchInfo - Contains information about the data fetching.
 * @param {(page: number, limit: number) => Promise<void>} fetchInfo.fetchData - Function to fetch data for the table.
 * @param {boolean} fetchInfo.isFetching - Indicates whether data is currently being fetched.
 * @param {Object} [queryInfo] - Contains information about the query string.
 * @param {string} [queryInfo.onLoadQuery] - Optional query string to be used when the component is loaded.
 * @param {Dispatch<SetStateAction<string>>} [queryInfo.setCurrentQuery] - Optional function to update the query string.
 * @param {(row: Record<string, any>) => void} [onRowClick] - Optional function that is called when a row in the table is clicked.
 * @param {Object} [defineActions] - Contains information about the actions that can be performed on the selected rows.
 * @param {ActionEventItem[]} [defineActions.actionList] - Optional array of actions that can be performed on the selected rows.
 * @param {(action: any, selectedRows: Record<string, any>[]) => void} [defineActions.onAction] - Optional function that is called when an action is performed.
 * @param {CustomButton} [newItemButton] - Optional button to create a new item.
 */
export interface DynamicTableProps<T extends Record<string, any>> {
  tableInfo: {
    tableName: string;
    tableData: Array<T>;
    setTableData?: Dispatch<SetStateAction<T[]>>;
    columns: DynColumnsDef[];
    expectedRowCount: number;
    paginationOptions?: {
      customPageRowCount?: number;
      customSelectPages?: number[];
    },
  },
  fetchInfo: {
    fetchData: (limit: number, filters: ActiveFilter[], firstLoad?: boolean) => Promise<void>;
    isFetching: boolean;
  }
  queryInfo: {
    onLoadQuery: string;
    setCurrentQuery: Dispatch<SetStateAction<string>>;
  };
  onRowClick?: (row: T) => void;
  defineActions: {
    actionList: ActionEventItem[];
    onAction: ActionEvent<T>;
  }
  newItemButton?: CustomButton;
}