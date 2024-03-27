import React, { useState, useEffect } from 'react';
import { Meta, Story } from '@storybook/react';
import { ActionEventItem, ActionType, ActiveFilter, DynColumnsDef, DynamicTable, DynamicTableProps } from '../../src/components/tables';
import { generateAsyncCount, generateAsyncData } from './mockdata';
export default {
  title: 'tables/DynamicV2',
  component: DynamicTable,
  /* argTypes: {
    paginationOptions: { changeSize: 'action' },
    hideColumnAction: { action: 'hide' },
    onSingleRowClick: { action: 'clickRow' },
    setSelected: { action: 'select' },
    onAction: { action: 'onAction' },
  }, */
} as Meta<DynamicTableProps<any>>;

export const DynamicV2Template: Story<DynamicTableProps<any>> = (args) => {

  const columns =
    [
      { accessor: 'id', label: 'ID', type: 'string', visible: false },
      { accessor: 'supplier.name', label: 'Supplier', type: 'string', visible: false },
      { accessor: 'code', label: 'Code', type: 'string', visible: true },
      { accessor: 'name', label: 'Name', type: 'string', isFilter: true, visible: true },
      { accessor: 'description', label: 'Description', type: 'string', visible: true },
      {
        accessor: 'status', label: 'Status', type: 'select', isFilter: true,
        SelectCell: [
          { id: 1, type: 'success', label: 'Published' },
          { id: 0, type: 'warning', label: 'Pending' },
        ], visible: true
      },
    ] as DynColumnsDef[];

  const [data, setData] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [expectedRowCount, setExpectedRowCount] = useState<number>(0);

  //const [fetchToken, setFetchToken] = useState<string>('');

  const fetchItemsHandler = async (limit: number, filters: ActiveFilter[], firstLoad?: boolean) => {

    try {

      setIsFetching(true);

      const rowCount = await generateAsyncCount(15);
      setExpectedRowCount(rowCount);

      const itemData = await generateAsyncData(limit);

      firstLoad
        ? setData(itemData)
        : setData(prevData => [...prevData, ...itemData]);

    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }

  };

  const actionList = [
    { type: 'delete', label: 'Delete', color: 'error', isIconButton: false },
  ] as ActionEventItem[];

  const [quickActions, setQuickActions] = useState<boolean>(false);

  const actionHandler = async (action: ActionType, selectedRows: any[]) => {

    const requestArray: Promise<any>[] = [];

    switch (action) {
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
  const [queryParamString, setQueryParamString] = useState<string>('');

  return (
    <>
      <DynamicTable
        tableInfo={{
          tableName: 'DynamicV2',
          tableData: data,
          columns: columns,
          expectedRowCount: expectedRowCount,
          paginationOptions: {
            customPageRowCount: 5,
            customSelectPages: [5, 10]
          },
        }}
        fetchInfo={{
          fetchData: fetchItemsHandler,
          isFetching: isFetching
        }}
        queryInfo={{
          onLoadQuery: queryParamString,
          setCurrentQuery: setQueryParamString
        }}
        onRowClick={(row) => {
          console.log('Row clicked:', row);
        }}
        defineActions={{
          actionList: actionList,
          onAction: (action, selectedRows) => actionHandler(action, selectedRows)
        }}
        newItemButton={{
          label: 'New Item',
          buttonClick: () => {
            console.log('New item clicked');
          }
        }}
      />
    </>
  );
};