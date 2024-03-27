import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import { CardItemProps } from './DynamicCardsTypes';

/* ---------- Cards ---------- */

export function SkeletonCard() {

  return (
    <Card
      sx={{ minWidth: 300, minHeight: 300 }}
    >
      <CardMedia
        component={Skeleton}
        variant='rectangular'
        height={210}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          <Skeleton variant='text' width={180} />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Skeleton variant='text' />
          <Skeleton variant='text' />
        </Typography>
      </CardContent>
    </Card>
  );

}

export function CardItem<T extends Record<string, any>>(props: CardItemProps<T>) {

  const { image, titleAccessor, descAccessor, paperVariant, onCardClick } = props;

  return (
    <Card
      variant={paperVariant ?? 'outlined'}
      sx={{ minWidth: 250, minHeight: 300 }}
      onClick={() => onCardClick}
    >
      <CardActionArea>
        <CardMedia
          component={image ? 'img' : Skeleton}
          variant='rectangular'
          height={240}
          image={image}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {titleAccessor}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {descAccessor}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

}

/* ---------- Body of Cards ---------- */

export interface CardBodyProps<T extends Record<string, any>> {
  tableData: T[];
  cardInfo: CardItemProps<T>;
  page: number;
  rowsPerPage: number;
  isFetching: boolean;
}

export function CardBodyCreator<T extends Record<string, any>>(props: CardBodyProps<T>) {

  const {
    tableData,
    cardInfo: {
      image,
      titleAccessor,
      descAccessor,
      onCardClick,
    },
    page,
    rowsPerPage,
    isFetching,
  } = props;

  const getNestedProperty = (row: T, path: string,) => {
    return path.split('.').reduce((nestedObject, property) => {
      return (nestedObject && property in nestedObject)
        ? nestedObject[property]
        : '';
    }, row).toString() ?? '';
  };

  const currentPageRows = rowsPerPage > 0
    ? tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : tableData;

  const skeletonItems = isFetching ? (rowsPerPage - currentPageRows.length) : 0;

  return (
    <>
      <Grid2
        container
        justifyContent="center"
        alignItems="center"
        spacing={{ sm: 2, md: 3, lg: 4 }}
      >

        {currentPageRows.map((row) => (
          <Grid2
            sm={12} md={6} lg={4}
            onClick={() => onCardClick(row)}
          >
            <CardItem
              key={row.id}
              image={image}
              titleAccessor={getNestedProperty(row, titleAccessor)}
              descAccessor={getNestedProperty(row, descAccessor)}
              onCardClick={() => onCardClick(row)}
            />
          </Grid2>
        ))}

        {Array.from({ length: skeletonItems }, (_, index) => (
          <Grid2
            sm={12} md={6} lg={4}
          >
            <SkeletonCard key={index} />
          </Grid2>
        ))}

      </Grid2>
    </>
  );
}