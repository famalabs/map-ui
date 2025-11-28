import React from 'react';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';

export const DateCell = (format = 'DD/MM/YYYY') => {
  const Renderer = ({ cellValue }: { cellValue: string }): React.ReactNode => {
    return <Grid container>{cellValue ? dayjs(cellValue).format(format) : ''}</Grid>;
  };
  Renderer.displayName = 'DateCell';
  return Renderer;
};
