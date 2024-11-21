import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ActionEventItem, ActiveCardFilter, CardFilterDef, DynamicCardsProps, DynamicCardsTable } from '../../src/components/tables';
import { generateAsyncCount, generateAsyncData } from './mockdata';

const meta: Meta<typeof DynamicCardsTable> = { component: DynamicCardsTable };
export default meta;

type Story = StoryObj<DynamicCardsProps<any>>;

export const DynamicCardsTableStory: Story = {

  render: (args) => {
    const columns = [
      { accessor: 'id', label: 'ID', },
      { accessor: 'name', label: 'Nome' },
    ] as CardFilterDef[];

    const [data, setData] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [expectedRowCount, setExpectedRowCount] = useState<number>(0);

    //const [fetchToken, setFetchToken] = useState<string>('');

    const fetchItemsHandler = async (limit: number, filters: ActiveCardFilter[], firstLoad?: boolean) => {

      try {

        console.log('Fetching: ', limit, filters, firstLoad);

        setIsFetching(true);

        const rowCount = await generateAsyncCount(20);
        setExpectedRowCount(rowCount);

        const itemData = await generateAsyncData(limit);
        console.log('Data fetched:', itemData);

        if (firstLoad) {
          setData(itemData)
        } else {
          setData(prevData => [...prevData, ...itemData])
        }

      } catch (e) {
        console.error(e);
      } finally {
        setIsFetching(false);
      }

    };

    const actionList = [
      { type: 'delete', label: 'Delete', color: 'error', isIconButton: false, refetch: true },
    ] as ActionEventItem[];

    const [quickActions, setQuickActions] = useState<boolean>(false);

    const actionHandler = async (actionType: string, selectedRows: any[], activeFilters: ActiveCardFilter[]) => {

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
      <Grid
        container
        size={12}
        spacing={2}
      >

        <Grid size={12}>
          <DynamicCardsTable
            tableInfo={{
              tableName: 'UserEventsTable',
              tableData: data,
              filtersDef: columns,
              expectedItemCount: expectedRowCount,
              tableVariant: 'standard',
              standardOptions: {
                customPageItemCount: 6,
                customSelectPages: [6, 12, 24],
              },
              infiniteOptions: {
                viewType: 'cards',
                loadingType: 'loadMore',
                itemsPerPage: 6,
                gridSizings: { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
              }
            }}
            fetchInfo={{
              fetchData: fetchItemsHandler,
              isFetching: isFetching,
            }}

            queryInfo={{
              onLoadQuery: '',
              setCurrentQuery: () => null,
            }}
            cardInfo={{
              CardItem: CardTest,
              SkeletonItem: undefined
            }}
          />
        </Grid>

      </Grid>
    );
  }
};

function CardTest<T>(entry: T) {


  return (
    <Card
      onClick={() => console.log('Card clicked: ', entry)}
      sx={{ minWidth: 300, minHeight: 300, cursor: 'pointer' }}
    >
      <CardMedia
        height={210}
        component="img"
        src='https://source.unsplash.com/random'
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {entry['id']}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {entry['name']}
        </Typography>
      </CardContent>
    </Card>
  );
}