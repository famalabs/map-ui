import { Dispatch, SetStateAction } from "react";
import { FilterType, FilterValue, NewSelectCellOption } from "../dynamicV2";

/**
 * Interface for the definition of the filters.
 * @param {string} accessor - The accessor of the column.
 * @param {string} label - The label of the column.
 * @param {string} type - The type of the column.
 * @param {NewSelectCellOption[]} SelectCell - The options for the select cell.
 */
export interface CardFilterDef {
  accessor: string;
  type: string;
  label: string;
  SelectCell?: NewSelectCellOption[];
}

/**
 * Interface for an active internal filter.
 * @param {string} filterName - The column of the filter.
 * @param {FilterValue} filterValue - The value of the filter.
 * @param {FilterType} filterType - The type of the filter.
 */
export interface ActiveCardFilter {
  filterName: string;
  filterValue: FilterValue;
  filterType?: FilterType;
}

/**
 * Interface for the props accepted by the CardItem component.
 * @param {string} image - The image of the card.
 * @param {string} title - The title of the card.
 * @param {string} description - The description of the card.
 * @param {'outlined' | 'elevation'} paperVariant - The variant of the paper.
 */
export interface CardItemProps<T extends Record<string, any>>{
  image: string;
  titleAccessor: string;
  descAccessor: string;
  paperVariant?: 'outlined' | 'elevation';
  onCardClick: (row: T) => void;
}

/**
 * Interface for the props accepted by the CardsTable component.
  * @param {string} tableName - The name of the table.
  * @param {T[]} tableData - The data of the table.
  * @param {Dispatch<SetStateAction<T[]>>} setTableData - The setter for the table data.
  * @param {CardFilterDef[]} filtersDef - The definition of the filters.
  * @param {number} expectedRowCount - The expected row count.
  * @param {number} customPageRowCount - The custom page row count.
  * @param {number[]} customSelectPages - The custom select pages.
  * @param {() => Promise<void>} fetchData - The function to fetch the data.
  * @param {boolean} isFetching - Indicates whether the data is being fetched.
  * @param {string} onLoadQuery - The query to load on mount.
  * @param {Dispatch<SetStateAction<string>>} setCurrentQuery - The setter for the current query.
  * @param {CardItemProps<T>} cardInfo - The props for the card item.
  */


export interface DynamicCardsProps<T extends Record<string, any>> {
  tableInfo: {
    tableName?: string;
    tableData: Array<T>;
    setTableData?: Dispatch<SetStateAction<T[]>>;
    filtersDef: CardFilterDef[];
    expectedRowCount: number;
    paginationOptions: {
      customPageRowCount?: number;
      customSelectPages?: number[];
    },
  },
  fetchInfo: {
    fetchData: (limit: number, filters: ActiveCardFilter[], firstLoad?: boolean) => Promise<void>;
    isFetching: boolean;
  }
  cardInfo: CardItemProps<T>;
  queryInfo: {
    onLoadQuery: string;
    setCurrentQuery: Dispatch<SetStateAction<string>>;
  };
}