import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SimpleTableProps, SimpleTable } from '@src/components/tables';
import { SimpleData, generateSimpleData, generateComplexData, ComplexData } from './mockdata';

export default {
  title: 'tables/Simple',
  component: SimpleTable,
  argTypes: {
    onSingleRowClick: { action: 'clickRow' },
  },
} as Meta<SimpleTableProps<SimpleData>>;

const Template: Story<SimpleTableProps<SimpleData>> = (args) => <SimpleTable {...args} />;

export const MainTemplate: Story<SimpleTableProps<SimpleData>> = Template.bind({});
MainTemplate.args = {
  tableProps: {
    columns: [
      { name: 'Name', accessor: 'name' },
      { name: 'Quantity', accessor: 'qty' },
      { name: 'Available', accessor: 'available' },
      { name: 'Prop', accessor: 'prop' },
    ],
    data: generateSimpleData(5),
  },
  loading: false,
};

export const NoClick: Story<SimpleTableProps<SimpleData>> = Template.bind({});
NoClick.args = {
  tableProps: {
    columns: [
      { name: 'Name', accessor: 'name' },
      { name: 'Quantity', accessor: 'qty' },
      { name: 'Available', accessor: 'available' },
      { name: 'Prop', accessor: 'prop' },
    ],
    data: generateSimpleData(5),
  },
  onSingleRowClick: undefined,
  loading: false,
};

export const ComplexTemplate: Story<SimpleTableProps<ComplexData>> = Template.bind({});
ComplexTemplate.args = {
  tableProps: {
    columns: [
      { name: 'Name', accessor: 'name' },
      { name: 'Quantity', accessor: 'qty' },
      { name: 'Available', accessor: 'available' },
      { name: 'Date', accessor: 'date' },
      { name: 'Status', accessor: 'status' },
    ],
    data: generateComplexData(5),
  },
  onSingleRowClick: undefined,
  loading: false,
};
