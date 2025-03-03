import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ActiveFilter, DynamicCardsProps, DynamicCardsTable } from '../../src/components/tables';
import { CardFilters } from '../../src/components/tables/dynamicCards/DynamicCardsTypes';
import { DynamicData, generateAsyncCount, generateAsyncData } from './mockdata';

const meta: Meta<typeof DynamicCardsTable> = { component: DynamicCardsTable };
export default meta;

type Story = StoryObj<DynamicCardsProps<any>>;

export const DynamicCardsTableStory: Story = {

  render: (args) => {

    const columns = [
      { accessor: 'id', label: 'ID' },
      { accessor: 'name', label: 'Nome', filterOptions: { type: 'string' } },
      { accessor: 'description', label: 'Description', filterOptions: { type: 'date' } },
    ] as CardFilters<any>[];

    const [data, setData] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [expectedRowCount, setExpectedRowCount] = useState<number>(0);

    //const [fetchToken, setFetchToken] = useState<string>('');

    const fetchItemsHandler = async (limit: number, filters: ActiveFilter[], firstLoad?: boolean) => {

      try {

        console.log('Fetching: ', limit, filters, firstLoad);

        setIsFetching(true);

        const rowCount = await generateAsyncCount(24);
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

    return (
      <Grid
        container
        size={12}
        spacing={2}
      >

        <Grid size={12}>
          <DynamicCardsTable<DynamicData>
            tableInfo={{
              tableName: 'UserEventsTable',
              tableData: data,
              filtersDef: columns,
              expectedItemCount: expectedRowCount,
              tableVariant: 'infinite',
              gridSizings: { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
              filterMode: 'multiple',
              // defaultShowFilters: true,
              standardOptions: {
                customPageItemCount: 6,
                customSelectPages: [6, 12, 24],
              },
              infiniteOptions: {
                viewType: 'dual',
                loadingType: 'loadMore',
                itemsPerPage: 6,
                switcherPosition: 'right',
              }
            }}
            fetchInfo={{
              fetchData: fetchItemsHandler,
              isFetching: isFetching,
            }}
            cardInfo={{
              CardItem: CardTest,
              ListItem: CardTest,
              SkeletonItem: undefined,
              SkeletonListItem: undefined
            }}
          />
        </Grid>

      </Grid>
    );
  }
};

function CardTest(entry: DynamicData) {

  return (
    <Card
      onClick={() => console.log('Card clicked: ', entry)}
      sx={{ minWidth: 300, minHeight: 300, cursor: 'pointer' }}
    >
      <CardMedia
        height={210}
        component="img"
        src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV3J7LwvhQh-hnL-YPvTn2A5JaIt6NVfpcqA&s'
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {entry.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {entry.description}
        </Typography>
      </CardContent>
    </Card>
  );
}