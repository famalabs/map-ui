
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { DynamicColumns, SelectCell } from '../../src/components/tables';
import { DynamicSimpleFilters } from '../../src/components/tables/dynamicV2/DynamicFilterHeader';

const columns =
  [
    { accessor: 'id', label: 'ID', visible: false },
    { accessor: 'supplier.name', label: 'Supplier', visible: false },
    { accessor: 'code', label: 'Code', type: 'string', visible: true },
    { accessor: 'name', label: 'Name', filterOptions: { type: 'string' }, visible: true },
    { accessor: 'description', label: 'Description', visible: true },
    {
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
      ]),
      visible: true
    },
  ] as DynamicColumns<any>[];

const mockSetFilters = jest.fn();

const mockProps = {
  columns: columns,
  activeFilters: [],
  setActiveFilters: mockSetFilters,
} as any;

describe('DynamicSimpleFilters', () => {

  beforeEach(() => {
    mockSetFilters.mockClear();
  });

  it('Renders without crashing', () => {
    render(<DynamicSimpleFilters {...mockProps} />);
  });

  it('Renders the correct number of filters', () => {

    const filterColumns = columns.filter(column => 'filterOptions' in column && column.visible);
    const filterColumnsNumber = filterColumns.length;

    const { queryAllByLabelText } = render(<DynamicSimpleFilters {...mockProps} />);
    const filters = queryAllByLabelText(/^filter-/);
    expect(filters).toHaveLength(filterColumnsNumber);

  });
  
  it('Updates filters correctly', async () => {

    const { queryAllByLabelText } = render(<DynamicSimpleFilters {...mockProps} />);
    const filters = queryAllByLabelText(/^filter-/);

    filters.forEach(async (filter, index) => {
      fireEvent.change(filter, { target: 'test' });
      await waitFor(() => expect(mockSetFilters).toHaveBeenCalledTimes(index + 1));
    });

  });

});
