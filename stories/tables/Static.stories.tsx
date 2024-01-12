import React from 'react';
import { Meta, Story } from '@storybook/react';
import { StaticTablePaginatedProps, StaticTablePaginated, AvatarCell, IActionType } from '../../src/components/tables';
import { SimpleData, generateSimpleData, generateComplexData, ComplexData } from './mockdata';

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

const Template: Story<StaticTablePaginatedProps<SimpleData>> = (args) => <StaticTablePaginated {...args} />;

export const SimpleTemplate: Story<StaticTablePaginatedProps<SimpleData>> = Template.bind({});
SimpleTemplate.args = {
  tableProps: {
    columns: [
      { name: 'Name', accessor: 'name' },
      { name: 'Quantity', accessor: 'qty' },
      { name: 'Available', accessor: 'available' },
      { name: 'Prop', accessor: 'prop' },
    ],
    data: generateSimpleData(25),
    initialState: { pageSize: 5 },
  },
  actionList: [ { type: 'add' as IActionType, text: 'Add', icon: <CheckIcon />, onlyIcon: true },
                { type: 'delete' as IActionType, text: 'Delete', icon: <DeleteIcon />, onlyIcon: true },
              ],
  loading: false,
  paginationOptions: {
    pageSizes: [3, 5, 10, 20],
    changeSize: (size) => null,
  },
  router: { query: {}, setQuery: (query) => null },
};

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
    ],
    data: generateComplexData(25),
    initialState: { pageSize: 5 },
  },
  actionList: [{ type: 'add' as IActionType, text: 'Add', icon: <CheckIcon />, onlyIcon: true },
  { type: 'delete' as IActionType, text: 'Delete', icon: <DeleteIcon />, onlyIcon: true },
  ],
  loading: false,
  paginationOptions: {
    pageSizes: [3, 5, 10, 20],
    changeSize: (size) => null,
  },
  router: { query: {}, setQuery: (query) => null },
};

export const SelectTest: Story<StaticTablePaginatedProps<ComplexData>> = (args) => {
  const [selects, setSelects] = React.useState<ComplexData[]>([]);

  return (
    <>
      <StaticTablePaginated {...args} setSelected={(objs) => setSelects(objs)} />
      <pre>
        <code>{JSON.stringify(selects, null, 2)}</code>
      </pre>
    </>
  );
};

SelectTest.args = {
  tableProps: {
    columns: [
      { name: 'Name', accessor: 'name' },
      { name: 'Quantity', accessor: 'qty' },
      { name: 'Available', accessor: 'available' },
      { name: 'Date', accessor: 'date', type: 'date' },
      { name: 'Status', accessor: 'status', type: 'select' },
    ],
    data: generateComplexData(25),
    getRowId: (row) => row.name,
    initialState: { pageSize: 5 },
  },
  actionList: [{ type: 'Add' as IActionType },
  { type: 'Delete' as IActionType, },
  ],
  loading: false,
  paginationOptions: {
    pageSizes: [3, 5, 10, 20],
  },
};
