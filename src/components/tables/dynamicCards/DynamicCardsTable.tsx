import ViewStreamIcon from '@mui/icons-material/ViewStream';
import WindowIcon from '@mui/icons-material/Window';
import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActiveFilter, QueryInfoProps } from '../dynamicV2';
import { DynamicSimpleFilters } from '../dynamicV2/DynamicFilterHeader';
import { localizedTableStrings } from '../dynamicV2/DynamicTableLocale';
import { CardBodyCreator } from './CardsBodyCreator';
import { DynamicCardsFooter } from './DynamcCardsFooter';
import { DynamicCardsProps, InfiniteViewType } from './DynamicCardsTypes';

export function DynamicCardsTable<T extends Record<string, any>>(props: DynamicCardsProps<T>) {

  const {
    tableInfo: {
      tableData,
      filtersDef,
      expectedItemCount,
      tableVariant = 'standard',
      gridSizings = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
      filterMode,
      defaultShowFilters,
      // showEmptyTable = true,
      standardOptions = {
        customPageItemCount: 6,
        customSelectPages: [6, 12, 24],
      },
      infiniteOptions = {
        loadingType: 'loadMore',
        itemsPerPage: 6,
        viewType: 'cards',
        switcherPosition: 'right',
        onViewTypeChange: () => null,
      },
    },
    fetchInfo: {
      fetchData,
      isFetching,
    },
    cardInfo,
    queryInfo = {} as QueryInfoProps,
    tableLocale = 'en',
    localeStr,
  } = props;

  const {
    customPageItemCount,
    customSelectPages
  } = standardOptions;

  const {
    loadingType,
    itemsPerPage,
    viewType,
    onViewTypeChange,
    switcherPosition,
  } = infiniteOptions;

  const { onLoadQuery, setCurrentQuery } = queryInfo;

  const currentLocale = useMemo(() => ({
    ...localizedTableStrings[tableLocale],
    ...localeStr,
  }), [tableLocale, localeStr]);

  const [selectedView, setSelectedView] = useState<InfiniteViewType | undefined>(viewType);

  /* Page index */
  const [currentPage, setCurrentPage] = useState<number>(0);

  /* Rows displayed per page */
  const itemsPerPageCount = tableVariant === 'standard' ? customPageItemCount : itemsPerPage;
  const [rowsPerPage, setRowsPerPage] = useState<number>(itemsPerPageCount ?? 5);

  /* Highest fetched page */
  const [highestFetchedPage, setHighestFetchedPage] = useState<number>(-1);

  /* Check for prefetched data */
  // const isActuallyFetching = isFetching && tableData.length === currentPage * rowsPerPage;
  const isNextPageFetched = highestFetchedPage >= currentPage;
  const isTableFetching = tableVariant === 'standard' ? !isNextPageFetched && (highestFetchedPage !== currentPage) : isFetching

  /* Active filters object */
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  /* Has loaded flag */
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  /* Has the fetch function been called */
  const [hasDataFetched, setHasDataFetched] = useState<boolean>(false);

  /* Fetching event function */
  const fetchEvent = useCallback(async (fetchType: 'first' | 'next' = 'next') => {
    const fetchCondition = tableVariant === 'standard' ? highestFetchedPage < currentPage : true;
    const itemsPerPage = tableVariant === 'standard' || loadingType === 'infiniteScroll' ? rowsPerPage * 2 : rowsPerPage;
    if (fetchType === 'first' || fetchCondition) {
      await fetchData(itemsPerPage, activeFilters, fetchType === 'first');
      setHasDataFetched(true);

      const highestFetchedPage = currentPage + 1;
      setHighestFetchedPage(fetchType === 'first' ? 0 : highestFetchedPage);
    }
  }, [tableVariant, highestFetchedPage, currentPage, loadingType, rowsPerPage, fetchData, activeFilters]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
    setHighestFetchedPage(-1);
  }, []);

  /* Fetch event effects  */

  useEffect(() => {
    /* Skip fetch is static mode is enabled */
    if (currentPage !== 0) fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    /* Skip fetch is static mode is enabled */
    if (hasLoaded) fetchEvent('first');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage]);

  /* Set has loaded flag */

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  /* View handler */

  const handleChageViewType = (
    event: React.MouseEvent<HTMLElement>,
    newView: InfiniteViewType | undefined,
  ) => {
    if (newView) {
      setSelectedView(newView);
      onViewTypeChange?.(newView);
    }
  };


  return (
    <>
      <Grid
        id='cards-table-header'
        container
        sx={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          my: 2
        }}
      >


        {/* Dual View Button */}
        <Grid
          container
          size={12}
          direction={switcherPosition === 'left' ? 'row-reverse' : 'row'}
          justifyContent={switcherPosition === 'left' ? 'left' : 'space-between'}
          alignItems='center'
          spacing={2}
        >

          {/* Filters Header */}
          <DynamicSimpleFilters
            columns={filtersDef}
            filterMode={filterMode}
            defaultShowFilters={defaultShowFilters}
            onLoadQuery={onLoadQuery}
            setCurrentQuery={setCurrentQuery}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            fetchEvent={fetchEvent}
            setCurrentPage={setCurrentPage}
            setHighestFetchedPage={setHighestFetchedPage}
            hasTableLoaded={hasLoaded}
            showRefreshButton={false}
            localeStr={currentLocale.filters}
          />

          {viewType === 'dual' &&
            <Grid>
              <ToggleButtonGroup
                exclusive
                value={selectedView}
                onChange={handleChageViewType}
                aria-label="list view"
                size='small'
                sx={{ alignSelf: 'center' }}
              >
                <ToggleButton
                  value="cards"
                  size='small'
                  color='primary'
                  sx={{ p: '5px' }}
                >
                  <WindowIcon fontSize='small' />
                </ToggleButton>
                <ToggleButton
                  // title='List View'
                  value="list"
                  size='small'
                  color='primary'
                  sx={{ p: '5px' }}
                >
                  <ViewStreamIcon fontSize='small' />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          }

        </Grid>

      </Grid>

      <Table sx={{ width: '100%', minWidth: 150 }}>

        {/* Table Body */}
        <CardBodyCreator
          tableVariant={tableVariant}
          tableData={tableData}
          cardInfo={cardInfo}
          standardOptions={{
            customPageItemCount,
            customSelectPages
          }}
          infiniteOptions={{
            loadingType,
            gridSizings,
            itemsPerPage,
            viewType: selectedView
          }}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          isFetching={isFetching}
        />

        {/* Table Pagination */}
        <DynamicCardsFooter
          tableData={tableData}
          tableVariant={tableVariant}
          currentPage={currentPage}
          expectedItemCount={expectedItemCount}
          fetchEvent={fetchEvent}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          isFetching={isTableFetching}
          hasDataFetched={hasDataFetched}
          loadingType={loadingType}
          rowsPerPage={rowsPerPage}
          customSelectPages={customSelectPages}
        />

      </Table>
    </>
  );
}