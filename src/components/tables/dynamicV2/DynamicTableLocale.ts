import { i18nStrings } from "./DynamicTypes";

export const localizedTableStrings: Record<string, i18nStrings> = {
  it: {
    header: {
      quickActions: 'Azioni Veloci',
      visibleColumns: 'Colonne Visibili',
      itemsSelected: 'Righe Selezionate: ',
    },
    filters: {
      addFilter: 'Aggiungi Filtro',
      removeFilter: 'Rimuovi Filtro',
      filterBy: 'Filtra per',
      moreFilters: 'Altri Filtri',
      date: 'Data',
      dateFrom: 'A partire dal',
      dateTo: 'Fino al',
      dateLanguage: 'it',
      apply: 'Applica',
      clear: 'Rimuovi filtri',
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
      visibleColumns: 'Visible Columns',
      itemsSelected: 'Items Selected: ',
    },
    filters: {
      addFilter: 'Add Filter',
      removeFilter: 'Remove Filter',
      filterBy: 'Filter by',
      moreFilters: 'More Filters',
      date: 'Date',
      dateFrom: 'From',
      dateTo: 'To',
      dateLanguage: 'en',
      apply: 'Apply',
      clear: 'Clear all filters',
    },
    footer: {
      rowsPerPage: 'Rows per page: ',
      of: 'of',
      elements: 'elements',
    },
  }
}
