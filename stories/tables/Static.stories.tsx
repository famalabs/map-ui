import React from 'react';
import { Meta, Story } from '@storybook/react';
import { StaticTablePaginatedProps, StaticTablePaginated, IActionType } from '../../src/components/tables';
import { SimpleData, generateComplexData, ComplexData } from './mockdata';

import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';

export default {
  title: 'tables/Static',
  component: StaticTablePaginated,
  argTypes: {
    paginationOptions: { changeSize: 'action' },
    hideColumnAction: { action: 'hide' },
    onSingleRowClick: { action: 'clickRow' },
    setSelected: { action: 'select' },
    onAction: { action: 'onAction' },
  },
} as Meta<StaticTablePaginatedProps<SimpleData>>;

export const ComplexTemplate: Story<StaticTablePaginatedProps<ComplexData>> = (args) => (
  <StaticTablePaginated {...args} />
);

ComplexTemplate.args = {
  tableProps: {
    columns: [
      { name: 'Name', accessor: 'name' },
      { name: 'Quantity', accessor: 'qty' },
      { name: 'Available', accessor: 'available' },
      { name: 'Date', accessor: 'date', type: 'date' },
      { name: 'Status', accessor: 'status', type: 'select' },
    ] as any,
    data: generateComplexData(25),
    initialState: { pageSize: 5 } as any,
  },
  actionList: [{ type: 'add' as IActionType, text: 'Add', icon: <CheckIcon />, onlyIcon: true },
  { type: 'delete' as IActionType, text: 'Delete', icon: <DeleteIcon />, onlyIcon: true },
  ],
  loading: false,
  paginationOptions: {
    pageSizes: [3, 5, 10, 20],
    //changeSize: (size) => null,
  },
  router: {
    queryEntries: [] as any,
    setQuery: (queryString) => console.log('SetQuery: ', queryString),
  },
  //onPageChange: (page) => (console.log(page)),
};