import { i18nStrings } from "./DynamicTypes";

export const localizedTableStrings: Record<string, i18nStrings> = {
  it: {
    header: {
      quickActions: 'Azioni Veloci',
      lockedColumns: 'Colonne Fisse',
      visibleColumns: 'Colonne Visibili',
      hiddenColumns: 'Colonne Nascoste',
      itemsSelected: 'Righe Selezionate',
      selectedAll: 'Seleziona Tutto',
      deselectAll: 'Deseleziona Tutto',
      allItemsSelected: 'Tutti gli elementi selezionati',
    },
    filters: {
      addFilter: 'Aggiungi Filtro',
      removeFilter: 'Rimuovi Filtro',
      filterBy: 'Filtra per',
      moreFilters: 'Altri Filtri',
      date: 'Data',
      exact: 'Esatta',
      dateFrom: 'A partire dal',
      dateTo: 'Fino al',
      range: 'Intervallo',
      dateLanguage: 'it',
      apply: 'Applica',
      clear: 'Rimuovi filtri',
      refresh: 'Aggiorna Tabella',
    },
    footer: {
      rowsPerPage: 'Righe per pagina: ',
      of: 'di',
      elements: 'elementi',
    },
  },
  en: {
    header: {
      quickActions: 'Quick Actions',
      lockedColumns: 'Fixed Columns',
      visibleColumns: 'Visible Columns',
      hiddenColumns: 'Hidden Columns',
      itemsSelected: 'Items Selected',
      selectedAll: 'Select All',
      deselectAll: 'Deselect All',
      allItemsSelected: 'All Items Selected',
    },
    filters: {
      addFilter: 'Add Filter',
      removeFilter: 'Remove Filter',
      filterBy: 'Filter by',
      moreFilters: 'More Filters',
      date: 'Date',
      exact: 'Exact',
      dateFrom: 'From',
      dateTo: 'To',
      range: 'Range',
      dateLanguage: 'en',
      apply: 'Apply',
      clear: 'Clear all filters',
      refresh: 'Refresh Table',
    },
    footer: {
      rowsPerPage: 'Rows per page: ',
      of: 'of',
      elements: 'elements',
    },
  }
}
