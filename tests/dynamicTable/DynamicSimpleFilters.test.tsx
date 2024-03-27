
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { DynColumnsDef, DynamicSimpleFilters, DynamicSimpleFiltersProps } from '../../src/components/tables/dynamicV2';

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

const mockSetFilters = jest.fn();

const mockProps = {
  columns: columns,
  activeFilters: [],
  setActiveFilters: mockSetFilters,
} as DynamicSimpleFiltersProps;

describe('DynamicSimpleFilters', () => {

  beforeEach(() => {
    mockSetFilters.mockClear();
  });

  it('Renders without crashing', () => {
    render(<DynamicSimpleFilters {...mockProps} />);
  });

  it('Renders the correct number of filters', () => {

    const filterColumns = columns.filter(column => column.isFilter && column.visible);
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
