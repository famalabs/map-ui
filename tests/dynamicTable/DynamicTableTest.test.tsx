
import { fireEvent, getByLabelText, getByText, render, waitFor } from '@testing-library/react';
import React from 'react';
import { DynColumnsDef, DynamicTable, DynamicTableProps } from '../../src/components/tables/dynamicV2';
import { generateComplexData } from '../../stories/tables/mockdata';

// Mock fetchData function
const mockFetchData = jest.fn();
const mockQuery = jest.fn();

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

const mockProps = {
  tableInfo: {
    tableName: 'DynamicV2Test',
    tableData: generateComplexData(5),
    columns: columns,
    expectedRowCount: 10,
    paginationOptions: {
      customPageRowCount: 5,
      customSelectPages: [5, 10]
    },
  },
  fetchInfo: {
    fetchData: mockFetchData,
    isFetching: false
  },
  queryInfo: {
    onLoadQuery: '',
    setCurrentQuery: mockQuery,
  },
  defineActions: {
    actionList: [],
    onAction: jest.fn()
  },
  onRowClick: jest.fn(),
  newItemButton: {
    label: 'New Item',
    buttonClick: () => {
      console.log('New item clicked');
    }
  }
} as DynamicTableProps<Record<string, any>>;

describe('DynamicTable', () => {

  beforeEach(() => {
    mockFetchData.mockClear();
  });

  it('Renders without crashing', () => {
    render(<DynamicTable {...mockProps} />);
  });

  it('Fetches initial data on render', async () => {

    const loadData = mockFetchData.mockResolvedValueOnce(generateComplexData(5));

    render(<DynamicTable {...mockProps} />);
    await waitFor(() => expect(loadData).toHaveBeenCalled());

  });

  it('Handles data fetching on page change correctly', async () => {

    const nextLoadData = mockFetchData.mockResolvedValueOnce(generateComplexData(5));

    const { getByRole } = render(<DynamicTable {...mockProps} />);

    const nextPageButton = getByRole('button', { name: /next-page/i });
    fireEvent.click(nextPageButton);
    await waitFor(() => expect(nextLoadData).toHaveBeenCalledTimes(1));

    const previousPageButton = getByRole('button', { name: /previous-page/i });
    fireEvent.click(previousPageButton);
    await waitFor(() => expect(nextLoadData).toHaveBeenCalledTimes(1));

  });

  it('Handles data fetching on row count change correctly', async () => {

    const nextLoadData = mockFetchData.mockResolvedValueOnce(generateComplexData(10));

    const { getByRole } = render(<DynamicTable {...mockProps} />);

    const rowCountSelect = getByRole('combobox', { name: /Rows per page:/i, expanded: false});
    fireEvent.change(rowCountSelect, { target: 10 });
    await waitFor(() => expect(nextLoadData).toHaveBeenCalledTimes(1));

  });

  it('Handles data fetching on query change correctly', async () => {

    const nextLoadData = mockFetchData.mockResolvedValueOnce(generateComplexData(5));

    const { getByLabelText } = render(<DynamicTable {...mockProps} />);

    const queryInput = getByLabelText(/filter-text/i);
    fireEvent.change(queryInput, { target: 'test' });
    await waitFor(() => expect(nextLoadData).toHaveBeenCalledTimes(1));

  });
  
});
