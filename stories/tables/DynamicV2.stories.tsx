import Grid from '@mui/material/Grid2';
import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ActionEventItem, ActiveFilter, AvatarCell, DynColumnsDef, DynamicTable, DynamicTableProps } from '../../src/components/tables';
import { generateAsyncData } from './mockdata';


const meta: Meta<typeof DynamicTable> = { component: DynamicTable };
export default meta;

type Story = StoryObj<DynamicTableProps<any>>;

export const DynamicV2Template: Story = {

  args: {
    tableLocale: "it"
  },

  render: (args) => {
    const columns =
      [
        {
          accessor: 'id', label: 'ID',
          Tooltip: {
            label: 'The ID of the item',
            color: 'primary'
          },
          visible: false
        },
        { accessor: 'supplier.name', label: 'Supplier', filterOptions: { type: 'number', priority: true }, visible: true },
        {
          accessor: 'code',
          label: 'Code',
          visible: true,
          Cell: AvatarCell(),
          filterOptions: {
            type: 'select', options: [
              { id: 'A', label: 'A' },
              { id: 'B', label: 'B' },
              { id: 'C', label: 'C' },
            ],
            priority: true
          },
        },
        { accessor: 'name', label: 'Name', visible: true, filterOptions: { type: 'date', priority: true }, Cell: ({ cellValue, currentRow }) => <div style={{ fontWeight: 600 }}>{cellValue + currentRow.supplier.name}</div>, },
        { accessor: 'description', label: 'Description', filterOptions: { type: 'string' }, visible: true },
        { accessor: 'description2', label: 'Description', visible: true },
        { accessor: 'description3', label: 'Description', visible: true },
        { accessor: 'description4', label: 'Description', visible: true },
        { accessor: 'description5', label: 'Description', visible: true },
        { accessor: 'description6', label: 'Description', visible: true },
        { accessor: 'description7', label: 'Description', visible: true },
        { accessor: 'description8', label: 'Description', visible: true },
        { accessor: 'description9', label: 'Description', visible: true },
        { accessor: 'description10', label: 'Description', visible: true },
        /* {
          accessor: 'status', label: 'Status',
          filterOptions: {
            type: 'select',
            options: [
              { id: 1, label: 'Published' },
              { id: 0, label: 'Pending' },
            ]
          },
          Cell: SelectCell([
            { id: 1, type: 'success', label: 'Published' },
            { id: 0, type: 'warning', label: 'Pending' },
          ])
        }, */
      ] as DynColumnsDef<any>[];

    const [data, setData] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [expectedRowCount, setExpectedRowCount] = useState<number>(0);

    //const [fetchToken, setFetchToken] = useState<string>('');

    const fetchItemsHandler = async (limit: number, filters: ActiveFilter[], firstLoad?: boolean) => {

      try {

        console.log('Fetching: ', limit, filters, firstLoad);

        setIsFetching(true);

        // const rowCount = await generateAsyncCount(20);
        setExpectedRowCount(60);

        const itemData = await generateAsyncData(60);
        console.log('Data fetched:', itemData);

        console.log('IS FIRST LOAD:', firstLoad);

        if (firstLoad) {
          setData(itemData)
        } else {
          setData(prevData => [...prevData, ...itemData])
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

    const [quickActions, setQuickActions] = useState<boolean>(false);

    const actionHandler = async (actionType: string, selectedRows: any[], activeFilters: ActiveFilter[]) => {

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
              setData(prevData => prevData.filter(item => !selectedRows.some(selected => selected.code === item.code)));
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
    const [queryParamString, setQueryParamString] = useState<string>('?filter[supplier.name]=5&filter[code]=A&filter[code]=B');
    React.useEffect(() => {
      console.log('Query string:', queryParamString);
    }, [queryParamString]);


    return (
      <Grid
        container
        size={12}
        spacing={2}
      >

        <Grid size={12}>
          <DynamicTable
            tableInfo={{
              tableName: 'DynamicV2',
              tableData: data,
              columns: columns,
              expectedRowCount: expectedRowCount,
              variant: 'standard',
              filterMode: 'multiple',
              staticMode: true,
              emptyTablePlaceholderSrc: 'https://theyouthproject.in/static/media/empty_data_set.88c7d759.png',
              paginationOptions: {
                customPageRowCount: 5,
                customSelectPages: [5, 10, 20],
                // autoSizeHeight: false,
                hideFooter: false,
              },
            }}
            fetchInfo={{
              fetchData: fetchItemsHandler,
              isFetching: isFetching,
              // prefetchNextPage: false,
            }}
            // queryInfo={{
            //   onLoadQuery: queryParamString,
            //   setCurrentQuery: setQueryParamString
            // }}
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
              }
            }}
            tableLocale={args.tableLocale}
            
          />
        </Grid>

      </Grid>
    );
  }
};