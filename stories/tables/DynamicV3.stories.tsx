import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import React from 'react';
import {
  ActionEventItem,
  ActiveFilter,
  AvatarCell,
  DateCell,
  DynamicColumns,
  DynamicTable,
  RealtimeTable,
  RealtimeTableProps,
  SelectCell,
} from '../../src/components/tables';
import { Meta, StoryObj } from '@storybook/react-vite';
import qs from 'qs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const filterComparatorMap: Record<string, string> = {
  dateMin: '$gte',
  dateMax: '$lte',
  dateFrom: '$gte',
  dateTo: '$lte',
};

const parseFilterQuery = (activeFilters: ActiveFilter[]) => {
  if (activeFilters.length === 0) return '';
  const filterQuery = activeFilters.reduce((obj: Record<string, any>, filter) => {
    // Check if it's a date filter with a comparator
    if (
      filter.filterType === 'date' &&
      typeof filter.filterValue === 'string' &&
      filter.filterComparator
    ) {
      const dateOperatorMatch = filterComparatorMap[filter.filterComparator];
      if (dateOperatorMatch) {
        obj[`filter[${filter.filterColumn}][${dateOperatorMatch}]`] = filter.filterValue;
        return obj;
      }
    }

    // Default handling for all other filters
    obj[`filter[${filter.filterColumn}]`] = filter.filterValue;
    return obj;
  }, {});
  return qs.stringify(filterQuery, { encode: false });
};

const meta: Meta<typeof DynamicTable> = { component: DynamicTable };
export default meta;

type Story = StoryObj<RealtimeTableProps<any>>;
const RenderTable = (args: RealtimeTableProps<any>) => {
  const [optionsPopover, setOptionsPopover] = React.useState<null | HTMLElement>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    setOptionsPopover(event.currentTarget);
  };

  const isPopoverOpen = Boolean(optionsPopover);

  const columns = React.useMemo(
    () =>
      [
        {
          accessor: 'id',
          label: 'ID',
          visible: true,
          locked: true,
        },
        {
          accessor: 'avatar',
          label: 'Avatar',
          Cell: AvatarCell(true),
          Tooltip: { color: 'primary' },
        },
        { accessor: 'email', label: 'Email', filterOptions: { type: 'string' }, priority: true },
        {
          accessor: 'date',
          label: 'Data',
          filterOptions: { type: 'date', priority: true },
          Cell: DateCell(),
          priority: true,
        },
        {
          accessor: 'data.name',
          label: 'Nome',
          filterOptions: { type: 'string' },
          priority: true,
        },
        { accessor: 'last_name', label: 'Cognome', priority: true },
        {
          accessor: 'status',
          label: 'Stato',
          visible: true,
          Cell: SelectCell([
            { id: 2, type: 'primary', label: 'Accettato' },
            { id: 1, type: 'success', label: 'Sottomesso' },
            { id: 0, type: 'warning', label: 'Non sottomesso' },
          ]),
          filterOptions: {
            type: 'select',
            options: [
              { id: 2, label: 'Accettato' },
              { id: true, label: 'Sottomesso' },
              { id: false, label: 'Non sottomesso' },
            ],
          },
        },
        {
          accessor: 'actions',
          label: 'Azioni',
          visible: true,
          Cell: () => (
            <Grid
              container
              size={12}
              justifyContent="flex-start"
              alignItems="center"
              flexWrap="nowrap"
              spacing={1}
            >
              <Grid>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Modifica
                </Button>
              </Grid>

              <Grid>
                <IconButton color="primary" onClick={handlePopoverOpen}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-more-vertical"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </IconButton>
              </Grid>
            </Grid>
          ),
        },
        // {
        //   accessor: 'data.code',
        //   label: 'Code',
        //   visible: true,
        //   Cell: AvatarCell(),
        //   filterOptions: {
        //     type: 'select',
        //     options: [
        //       { id: 'A', label: 'A' },
        //       { id: 'B', label: 'B' },
        //       { id: 'C', label: 'C' },
        //     ],
        //     priority: true,
        //   },
        //   maxWidth: '300px',
        // },
        // { accessor: 'name', label: 'Name', filterOptions: { type: 'date', priority: true }, Cell: ({ cellValue, currentRow }) => <div style={{ fontWeight: 600 }}>{cellValue + currentRow.supplier.name}</div>, },
        // { accessor: 'description', label: 'Description', filterOptions: { type: 'string' }, visible: true },
        // { accessor: 'description2', label: 'Description', visible: true },
        // { accessor: 'description3', label: 'Description', visible: true },
      ] as DynamicColumns<any>[],
    [],
  );

  const [queryParamString, setQueryParamString] = React.useState<string>('');

  const [editableQueryString, setEditableQueryString] = React.useState<string>('');
  React.useEffect(() => {
    setEditableQueryString(queryParamString);
  }, [queryParamString]);

  const [data, setData] = React.useState<any[]>([]);
  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [expectedRowCount, setExpectedRowCount] = React.useState<number>(0);

  //const [fetchToken, setFetchToken] = useState<string>('');

  const fetchItemsHandler = async (
    limit: number,
    filters: ActiveFilter[],
    direction?: 'left' | 'right' | 'reset',
  ) => {
    try {
      console.log('Fetching: ', limit, filters, direction);

      setIsFetching(true);

      // const rowCount = await generateAsyncCount(20);
      const requestFilters = filters
        .map((filter) => `${filter.filterColumn}=${filter.filterValue}`)
        .join('&');

      const url = `https://reqres.in/api/users?per_page&${requestFilters}`;
      const api_key = 'reqres-free-v1';
      const currentPageData = await fetch(
        `${url}&page=1&per_page=${limit}${requestFilters ? '&' + requestFilters : ''}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': api_key,
          },
        },
      ).then((response) => response.json());

      setExpectedRowCount(currentPageData?.total);
      console.log('Data fetched: ', currentPageData);

      const filterParam = filters.length ? parseFilterQuery(filters) : '';
      setQueryParamString(filterParam);

      const nextPageData = await fetch(`${url}&page=2`).then((response) => response.json());
      const prevPageData = await fetch(`${url}&page=1`).then((response) => response.json());
      const customData = currentPageData.data.map((item: Record<string, any>) => ({
        ...item,
        date: new Date().toISOString(),
        status: Math.floor(Math.random() * 3),
      }));

      const shuffledData = [
        ...(customData || []),
        ...(customData || []),
        ...(customData || []),
      ].sort(() => Math.random() - 0.5);
      console.log('Shuffled data: ', shuffledData);
      setData(shuffledData);
      return {
        prevCount: prevPageData?.data?.length || 1,
        nextCount: nextPageData?.data?.length || 1,
      };
    } catch (e) {
      console.error(e);
      return {
        prevCount: 0,
        nextCount: 0,
      };
    } finally {
      setIsFetching(false);
    }
  };

  const actionList = [
    { type: 'delete', label: 'Delete', color: 'error', isIconButton: false, refetch: true },
    {
      type: 'export',
      label: 'Export',
      color: 'success',
      isIconButton: false,
      refetch: true,
    },
  ] as ActionEventItem[];

  const contextMenuList = [
    { type: 'import', label: 'Import', isIconButton: false, refetch: true },
  ] as ActionEventItem[];

  const [, setQuickActions] = React.useState<boolean>(false);

  const actionHandler = async (
    actionType: string,
    selectedRows: any[],
    activeFilters: ActiveFilter[],
  ) => {
    const requestArray: Promise<any>[] = [];

    switch (actionType) {
      case 'import':
        console.log('Import action triggered', selectedRows[0], activeFilters);
        break;
      case 'export':
        console.log('Export action triggered', selectedRows[0], activeFilters);
        break;
      case 'delete':
        console.log('Delete action triggered for rows: ', selectedRows);
        for (const item of selectedRows) {
          requestArray.push(item.code);
        }

        await Promise.all(requestArray)
          .then(() => {
            setData((prevData) =>
              prevData.filter(
                (item) => !selectedRows.some((selected) => selected.code === item.code),
              ),
            );
            console.log('Deleted');
            setQuickActions(false);
          })
          .catch(() => {
            console.error('Error deleting');
          });

        break;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
      <Grid container size={12} spacing={2}>
        <Grid size={12} container alignItems="center" spacing={1}>
          <Grid>Current Query String:</Grid>
          <Grid flexGrow={1}>
            <input
              type="text"
              value={editableQueryString}
              onChange={(e) => setEditableQueryString(e.target.value)}
              id="query-param-input"
              style={{ width: '100%', padding: '8px' }}
            />
          </Grid>
          <Grid>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setQueryParamString(editableQueryString);
              }}
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
        <Grid container size={12} spacing={2}>
          <RealtimeTable
            tableInfo={{
              tableName: 'DynamicV2',
              tableData: data,
              columns: columns,
              expectedRowCount: expectedRowCount,
              variant: 'standard',
              filterMode: 'single',
              // defaultShowFilters: false,
              emptyTablePlaceholderSrc:
                'https://theyouthproject.in/static/media/empty_data_set.88c7d759.png',
              paginationOptions: {
                customPageRowCount: 20,
                customSelectPages: [5, 10, 20],
                // autoSizeHeight: false,
                hideFooter: true,
                footerVariant: 'standard',
              },
            }}
            fetchInfo={{
              fetchData: fetchItemsHandler,
              fetchAllData: async () => [],
              isFetching: isFetching,
            }}
            queryInfo={{
              filtersQuery: queryParamString,
            }}
            onRowClick={(row) => {
              console.log('Row clicked:', row);
            }}
            defineActions={{
              actionList: actionList,
              onAction: actionHandler,
            }}
            contextMenuActions={{
              actionList: contextMenuList,
              onAction: actionHandler,
            }}
            newItemButton={{
              label: 'New Item',
              buttonClick: () => {
                console.log('New item clicked');
              },
            }}
            exportButton={{
              label: 'Esporta',
              buttonClick: () => {
                console.log('Export clicked');
              },
            }}
            actionButton={{
              label: 'AZIONI',
              // icon: 'CIAO',
              // activeIcon: 'CIAO CIAO',
              buttonClick: () => {
                console.log('AZIONI clicked');
              },
            }}
            columnsButton={{
              label: 'COLONNE',
              // icon: 'CIAO',
              buttonClick: () => {
                console.log('COLONNE clicked');
              },
            }}
            tableLocale={args.tableLocale || 'it'}
          />
        </Grid>
        <Popover
          open={isPopoverOpen}
          onClose={() => setOptionsPopover(null)}
          anchorEl={optionsPopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <List dense>
            <ListItemButton
              onClick={() => {
                setOptionsPopover(null);
              }}
            >
              <ListItemText primary={'Pubblica'} />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setOptionsPopover(null);
              }}
            >
              <ListItemText primary={'Rinomina'} />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setOptionsPopover(null);
              }}
            >
              <ListItemText primary="Duplica" />
            </ListItemButton>
          </List>
        </Popover>
      </Grid>
    </LocalizationProvider>
  );
};

export const DynamicV3Template: Story = {
  args: {
    tableLocale: 'it',
  },

  render: (args) => <RenderTable {...args} />,
};
