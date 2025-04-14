import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import React, { useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import { CardItemInfo, InfiniteViewType } from './DynamicCardsTypes';

/* ---------- Cards ---------- */

export function DefaultSkeletonCard() {

  return (
    <Card
      sx={{ minWidth: 150, minHeight: 300 }}
    >
      <CardMedia
        component={Skeleton}
        variant='rectangular'
        height={210}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          <Skeleton variant='text' width='30%' />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Skeleton variant='text' width='70%' />
        </Typography>
      </CardContent>
    </Card>
  );

}

interface CardItemProps<T extends Record<string, any>> {
  entry: T;
  paperVariant?: 'outlined' | 'elevation';
  onCardClick: () => void;
}

export function DefaultCardItem<T extends Record<string, any>>(props: CardItemProps<T>) {

  const { entry, paperVariant, onCardClick } = props;

  return (
    <Card
      variant={paperVariant ?? 'outlined'}
      sx={{ minWidth: 250, minHeight: 300 }}
      onClick={() => onCardClick}
    >
      <CardActionArea>
        <CardMedia
          component={entry?.image ? 'img' : Skeleton}
          variant='rectangular'
          height={240}
          image={entry?.image ?? ''}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {entry?.title ?? 'Title'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {entry?.description ?? 'Description'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

}

/* ---------- Body of Cards ---------- */

export interface CardBodyProps<T extends Record<string, any>> {
  tableVariant: 'standard' | 'infinite';
  tableData: T[];
  standardOptions?: {
    customPageItemCount: number;
    customSelectPages: number[];
  };
  infiniteOptions?: {
    loadingType: 'infiniteScroll' | 'loadMore';
    gridSizings: Record<string, number>;
    itemsPerPage: number;
    viewType: InfiniteViewType;
  };
  cardInfo: CardItemInfo<T>;
  page: number;
  rowsPerPage: number;
  isFetching: boolean;
}

export function CardBodyCreator<T extends Record<string, any>>(props: CardBodyProps<T>) {

  const {
    tableVariant,
    tableData,
    cardInfo,
    // standardOptions,
    infiniteOptions,
    page,
    rowsPerPage,
    isFetching,
  } = props;

  const { CardItem, ListItem, SkeletonItem, SkeletonListItem } = cardInfo;

  const {
    gridSizings = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
    viewType = 'cards',
    itemsPerPage,
  } = infiniteOptions || {};

  const currentPageRows = useMemo(() =>
    rowsPerPage > 0
      ? tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : tableData
    , [tableData, page, rowsPerPage]);

  const skeletonItems = isFetching
    ? tableVariant === 'standard' ? (rowsPerPage - currentPageRows.length) : (itemsPerPage ?? 0)
    : 0;

  const gridTemplateSizings = useMemo(() => ({
    xs: `repeat(${gridSizings.xs}, minmax(0, 1fr))`,
    sm: `repeat(${gridSizings.sm}, minmax(0, 1fr))`,
    md: `repeat(${gridSizings.md}, minmax(0, 1fr))`,
    lg: `repeat(${gridSizings.lg}, minmax(0, 1fr))`,
    xl: `repeat(${gridSizings.xl}, minmax(0, 1fr))`,
  }), [gridSizings]);

  const StandardBodyLayout = useCallback(() => (
    <>
      {currentPageRows.map((row) => (
        <CardItem
          key={row.id}
          {...row}
        />
      ))}

      {Array.from({ length: skeletonItems }, (_, index) => (
        <Grid key={`grid-skeleton-${index}`} size={12}>
          {SkeletonItem ? <SkeletonItem /> : <DefaultSkeletonCard />}
        </Grid>
      ))}
    </>
  ), [currentPageRows, skeletonItems, CardItem, SkeletonItem]);


  const InfiniteBodyLayout = useCallback(() => {

    const CardElement = viewType === 'cards' ? CardItem : ListItem;
    const SkeletonElement = viewType === 'cards' ? SkeletonItem : SkeletonListItem;

    return (
      <>
        {CardElement && tableData.map((row) => (
          <CardElement
            key={row.id}
            {...row}
          />
        ))}

        {Array.from({ length: skeletonItems }, (_, index) => (
          <Grid key={`grid-skeleton-${index}`} size={12}>
            {SkeletonElement ? <SkeletonElement /> : <DefaultSkeletonCard />}
          </Grid>
        ))}
      </>
    );

  }, [viewType, CardItem, ListItem, SkeletonItem, SkeletonListItem, tableData, skeletonItems]);

  return (
    <Box
      id={`cards-table-body-${tableVariant}`}
      component="div"
      sx={{
        display: 'grid',
        gridTemplateColumns:
          viewType === 'cards' ? gridTemplateSizings : '1fr',
        gap: '32px 32px',
      }}
    >
      {tableVariant === 'standard' ? <StandardBodyLayout /> : <InfiniteBodyLayout />}
    </Box>
  );

}