import React from 'react';

import { Meta, Story } from '@storybook/react';
import {
  SimpleTableProps,
  SimpleTable,
  StaticTablePaginated,
  StaticTablePaginatedProps,
  BooleanCell,
  DateCell,
  ActionCell,
  LinkCell,
  AvatarCell,
  StatusCell,
  ImageCell,
  SelectCell,
} from '@src/components/tables';
import { ComplexData, generateComplexData } from './mockdata';
import {Warning} from '@mui/icons-material';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export default {
  title: 'tables/Cells',
  component: SimpleTable,
  argTypes: {
    paginationOptions: { changeSize: 'action' },
    hideColumnAction: { action: 'hide' },
    setSelected: { action: 'select' },
    onSingleRowClick: { action: 'clickRow' },
  },
} as Meta<SimpleTableProps<ComplexData>>;

const Template: Story<SimpleTableProps<ComplexData>> = (args) => <SimpleTable {...args} />;

export const SimpleTemplate: Story<SimpleTableProps<ComplexData>> = Template.bind({});
SimpleTemplate.args = {
  tableProps: {
    columns: [
      { name: 'Name', accessor: 'name', Cell: AvatarCell() },
      { name: 'Available', accessor: 'available', Cell: BooleanCell((value) => value.toString()) },
      { name: 'Status', accessor: 'status', Cell: StatusCell((value) => value), type: 'select' },
      {
        name: 'State',
        id: 'state',
        accessor: 'status',
        type: 'select',
        Cell: SelectCell([
          { id: 'active', type: 'success' },
          { id: 'pending', type: 'warning' },
          { id: 'canceled', type: 'error', Content: 'deleted' },
        ]),
      },
      { name: 'Date', accessor: 'date' },
      { id: 'alert', Cell: ActionCell((obj) => alert(`Alerted ${obj.name}`), { icon: <Warning /> }) },
      {
        id: 'alert2',
        Cell: ActionCell((obj) => alert(`Alerted ${obj.name}`), {
          label: 'alert',
          startIcon: <Warning />,
        }),
      },
      {
        id: 'link',
        name: 'link',
        Cell: LinkCell(
          (obj) => console.log(`Push link with ${obj.name}`),
          (obj) => `Go to ${obj.name} link`
        ),
      },
      { id: 'ID'},
    ],
    data: generateComplexData(7),
  },
};

export const StaticTemplate: Story<StaticTablePaginatedProps<ComplexData>> = (args) => (
  <StaticTablePaginated {...args} />
);
StaticTemplate.args = {
  tableProps: {
    columns: [
      { name: 'Name', accessor: 'name', Cell: AvatarCell() },
      { name: 'Available', accessor: 'available', Cell: BooleanCell((value) => value.toString()) },
      { name: 'Status', accessor: 'status', Cell: StatusCell((value) => value), type: 'select' },
      { name: 'Date', accessor: 'date' },
      { id: 'alert', Cell: ActionCell((obj) => alert(`Alerted ${obj.name}`), { icon: <Warning /> }) },
      {
        id: 'alert2',
        Cell: ActionCell((obj) => alert(`Alerted ${obj.name}`), {
          label: 'alert',
          startIcon: <Warning />,
        }),
      },
      {
        id: 'link',
        name: 'link',
        Cell: LinkCell(
          (obj) => console.log(`Push link with ${obj.name}`),
          (obj) => `Go to ${obj.name} link`
        ),
      },
      { id: 'ID' },
    ],
    data: generateComplexData(20),
    initialState: { pageSize: 5 },
  },
  loading: false,
  paginationOptions: {
    pageSizes: [3, 5, 10, 20],
    changeSize: (size) => null,
  },
  router: { query: {}, setQuery: (query) => null },
};
