import { Dispatch, SetStateAction } from "react";
import { DynamicColumns, FetchInfoProps, i18nStrings, QueryInfoProps } from "../dynamicV2/DynamicTypes";

export type CardFilters<T> = Omit<DynamicColumns<T>, 'Cell' | 'ColumnCell' | 'Tooltip' | 'maxWidth' | 'visible'>;
export type InfiniteViewType = 'list' | 'cards' | 'dual';

export interface DynamicCardInfo<T extends Record<string, any>> {
  tableName?: string;
  tableData: Array<T>;
  setTableData?: Dispatch<SetStateAction<T[]>>;
  filtersDef: CardFilters<T>[];
  expectedItemCount: number;
  tableVariant: 'standard' | 'infinite';
  gridSizings?: { xs: number, sm: number, md: number, lg: number, xl: number };
  filterMode?: 'single' | 'multiple';
  defaultShowFilters?: boolean;
  standardOptions?: {
    customPageItemCount?: number;
    customSelectPages?: number[];
  }
  infiniteOptions?: {
    loadingType: 'infiniteScroll' | 'loadMore';
    itemsPerPage?: number;
    viewType: InfiniteViewType;
    switcherPosition?: 'left' | 'right';
  }
}

export interface CardItemInfo<T extends Record<string, any>> {
  CardItem: (item: T) => JSX.Element;
  ListItem?: (item: T) => JSX.Element;
  SkeletonItem?: () => JSX.Element;
  SkeletonListItem?: () => JSX.Element;
}

/**
 * Interface for the props accepted by the CardsTable component.
  * @param T - The type of the data to be displayed in the table.
  * @param tableInfo - The information about the table.
  * @param fetchInfo - The information about the fetching of the data.
  * @param cardInfo - The information about the cards to be displayed.
  * @param queryInfo - The information about the query.
  * @param tableLocale - The locale of the table.
  * @param localeStr - The localized strings.
  */


export interface DynamicCardsProps<T extends Record<string, any>> {
  tableInfo: DynamicCardInfo<T>;
  fetchInfo: FetchInfoProps;
  cardInfo: CardItemInfo<T>;
  queryInfo?: QueryInfoProps;
  tableLocale?: 'en' | 'it';
  localeStr?: i18nStrings;
}