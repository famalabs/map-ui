import Grid from '@mui/material/Grid';
import { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import {
  ActionEventItem,
  ActiveFilter,
  DynamicColumns,
  DynamicTable,
  DynamicTableProps,
} from '../../src/components/tables';

const meta: Meta<typeof DynamicTable> = { component: DynamicTable };
export default meta;

type Story = StoryObj<DynamicTableProps<any>>;

export const DynamicV2Template: Story = {
  args: {
    tableLocale: 'it',
  },

  render: (args) => {
    const columns = [
      {
        accessor: 'id',
        label: 'ID',
        // Tooltip: {
        //   label: 'The ID of the item',
        //   color: 'primary'
        // },
        visible: false,
        locked: true,
      },
      {
        accessor: 'postId',
        label: 'Post ID',
        // Tooltip: {
        //   label: 'The ID of the user',
        //   color: 'primary'
        // },
        filterOptions: { type: 'number', priority: true },
        priority: true,
        maxWidth: '20px',
      },
      { accessor: 'name', label: 'Nome', filterOptions: { type: 'string', priority: true } },
      { accessor: 'email', label: 'Email', filterOptions: { type: 'string', priority: true } },
      { accessor: 'body', label: 'Descrizione', priority: true },
      // {
      //   accessor: 'code',
      //   label: 'Code',
      //   visible: true,
      //   Cell: AvatarCell(),
      //   filterOptions: {
      //     type: 'select', options: [
      //       { id: 'A', label: 'A' },
      //       { id: 'B', label: 'B' },
      //       { id: 'C', label: 'C' },
      //     ],
      //     priority: true
      //   },
      //   maxWidth: '300px'
      // },
      // { accessor: 'name', label: 'Name', filterOptions: { type: 'date', priority: true }, Cell: ({ cellValue, currentRow }) => <div style={{ fontWeight: 600 }}>{cellValue + currentRow.supplier.name}</div>, },
      // { accessor: 'description', label: 'Description', filterOptions: { type: 'string' }, visible: true },
      // { accessor: 'description2', label: 'Description', visible: true },
      // { accessor: 'description3', label: 'Description', visible: true },
    ] as DynamicColumns<any>[];

    const [data, setData] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [expectedRowCount, setExpectedRowCount] = useState<number>(0);

    //const [fetchToken, setFetchToken] = useState<string>('');

    const fetchItemsHandler = async (
      limit: number,
      filters: ActiveFilter[],
      firstLoad?: boolean,
    ) => {
      try {
        console.log('Fetching: ', limit, filters, firstLoad);

        setIsFetching(true);

        // const rowCount = await generateAsyncCount(20);
        const requestFilters = filters
          .map((filter) => `${filter.filterColumn}=${filter.filterValue}`)
          .join('&');

        const itemData = await fetch(
          `https://jsonplaceholder.typicode.com/comments?${requestFilters}`,
        ).then((response) => response.json());
        setExpectedRowCount(itemData?.length);

        console.log('Data fetched: ', itemData, 'First load:', firstLoad);

        if (firstLoad) {
          setData(itemData);
        } else {
          setData((prevData) => [...prevData, ...itemData]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsFetching(false);
      }
    };

    const actionList = [
      { type: 'delete', label: 'Delete', color: 'error', isIconButton: false, refetch: true },
      { type: 'export', label: 'Export', color: 'success', isIconButton: false, refetch: true },
    ] as ActionEventItem[];

    const [, setQuickActions] = useState<boolean>(false);

    const actionHandler = async (actionType: string, selectedRows: any[]) => {
      const requestArray: Promise<any>[] = [];

      switch (actionType) {
        case 'import':
          break;
        case 'delete':
          for (const item of selectedRows) {
            requestArray.push(item.code);
          }

          await Promise.all(requestArray)
            .then(() => {
              setData((prevData) =>
                prevData.filter(
                  (item) => !selectedRows.some((selected) => selected.code === item.code),
                ),
              );
              console.log('Deleted');
              setQuickActions(false);
            })
            .catch(() => {
              console.error('Error deleting');
            });

          break;
      }
    };

    /* Readonly? queryParamString to set URL */
    const [queryParamString, setQueryParamString] = useState<string>(
      '?filter[postId]=3&filter[email]=B&filter[name]=C&filter[name]=D',
    );
    React.useEffect(() => {
      console.log('Query string:', queryParamString);
    }, [queryParamString]);

    return (
      <Grid container size={12} spacing={2}>
        <Grid size={12}>
          <DynamicTable
            tableInfo={{
              tableName: 'DynamicV2',
              tableData: data,
              columns: columns,
              // startingPage: 2,
              expectedRowCount: expectedRowCount,
              variant: 'standard',
              filterMode: 'single',
              // defaultShowFilters: false,
              staticMode: false,
              emptyTablePlaceholderSrc:
                'https://theyouthproject.in/static/media/empty_data_set.88c7d759.png',
              paginationOptions: {
                customPageRowCount: 5,
                customSelectPages: [5, 10, 20],
                // autoSizeHeight: false,
                hideFooter: false,
                // footerVariant: 'simple',
              },
            }}
            fetchInfo={{
              fetchData: fetchItemsHandler,
              isFetching: isFetching,
              // prefetchNextPage: false,
            }}
            queryInfo={{
              onLoadQuery: queryParamString,
              setCurrentQuery: setQueryParamString,
            }}
            onRowClick={(row) => {
              console.log('Row clicked:', row);
            }}
            defineActions={{
              actionList: actionList,
              onAction: actionHandler,
            }}
            newItemButton={{
              label: 'New Item',
              buttonClick: () => {
                console.log('New item clicked');
              },
            }}
            exportButton={{
              label: 'Esporta',
              buttonClick: () => {
                console.log('Export clicked');
              },
            }}
            actionButton={{
              label: 'AZIONI',
              // icon: 'CIAO',
              // activeIcon: 'CIAO CIAO',
              buttonClick: () => {
                console.log('AZIONI clicked');
              },
            }}
            columnsButton={{
              label: 'COLONNE',
              // icon: 'CIAO',
              buttonClick: () => {
                console.log('COLONNE clicked');
              },
            }}
            tableLocale={args.tableLocale}
          />
        </Grid>
      </Grid>
    );
  },
};
