import React, { useState, useEffect } from 'react';
import { Meta, Story } from '@storybook/react';
import { ActionEventItem, ActiveFilter, DynColumnsDef, DynamicTable, DynamicTableProps } from '../../src/components/tables';
import { generateAsyncCount, generateAsyncData } from './mockdata';

import {
  BooleanCell,
  DateCell,
  ActionCell,
  LinkCell,
  AvatarCell,
  StatusCell,
  ImageCell,
  SelectCell,
} from '../../src/components/tables';


export default {
  title: 'tables/DynamicV2',
  component: DynamicTable,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<DynamicTableProps<any>>;

export const DynamicV2Template: Story<DynamicTableProps<any>> = (args) => {

  const columns =
    [
      { accessor: 'id', label: 'ID', visible: false },
      { accessor: 'supplier.name', label: 'Supplier', filterOptions: { type: 'string' }, visible: true },
      { accessor: 'code', label: 'Code', visible: true, Cell: AvatarCell() },
      { accessor: 'name', label: 'Name', visible: true },
      { accessor: 'description', label: 'Description', visible: true },
      {
        accessor: 'status', label: 'Status', 
        filterOptions: {type: 'select', options: [
          { id: 1, label: 'Published' },
          { id: 0, label: 'Pending' },
        ]},
        Cell: SelectCell([
          { id: 1, type: 'success', label: 'Published' },
          { id: 0, type: 'warning', label: 'Pending' },
        ])
      },
    ] as DynColumnsDef[];

  const [data, setData] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [expectedRowCount, setExpectedRowCount] = useState<number>(0);

  //const [fetchToken, setFetchToken] = useState<string>('');

  const fetchItemsHandler = async (limit: number, filters: ActiveFilter[], firstLoad?: boolean) => {

    try {

      console.log('Active Filters: ', filters);

      setIsFetching(true);

      const rowCount = await generateAsyncCount(10);
      setExpectedRowCount(rowCount);

      const itemData = await generateAsyncData(10);

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
  //const [queryParamString, setQueryParamString] = useState<string>('');


  return (
    <>
      <DynamicTable
        tableInfo={{
          tableName: 'DynamicV2',
          tableData: data,
          columns: columns,
          expectedRowCount: expectedRowCount,
          emptyTablePlaceholderSrc: 'https://theyouthproject.in/static/media/empty_data_set.88c7d759.png',
          paginationOptions: {
            customPageRowCount: 5,
            customSelectPages: [5, 10, 20],
            autoSizeHeight: true,
          },
        }}
        fetchInfo={{
          fetchData: fetchItemsHandler,
          isFetching: isFetching
        }}
        /* queryInfo={{
          onLoadQuery: queryParamString,
          setCurrentQuery: setQueryParamString
        }} */
        onRowClick={(row) => {
          console.log('Row clicked:', row);
        }}
        /* defineActions={{
          actionList: actionList,
          onAction: (action, selectedRows) => actionHandler(action, selectedRows)
        }} */
        newItemButton={{
          label: 'New Item',
          buttonClick: () => {
            console.log('New item clicked');
          }
        }}
        localeStr={{
          quickActions: 'Azioni Veloci',
          visibleColumns: 'Colonne Visibili',
          itemsSelected: 'Righe Selezionate: ',
          rowsPerPage: 'Righe per pagina: ',
          of: 'di',
        }}
      />
    </>
  );
};