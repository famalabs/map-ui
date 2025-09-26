import React from 'react';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Grid from '@mui/material/Grid';

export const BooleanCell = (
  toolTip?: (value: string) => string,
  tooltipProps?: Omit<TooltipProps, 'title' | 'children'>
) => ({ cellValue }: { cellValue: any }): React.ReactNode => {

  if (typeof cellValue === 'undefined' || cellValue === null) {
    return (
      <Grid container>
        {''}
      </Grid>
    )
  }

  return (
    <Grid>
      <Tooltip title={toolTip && toolTip(cellValue)} {...tooltipProps}>
        {cellValue ? <CheckCircleIcon /> : <ErrorIcon />}
      </Tooltip>
    </Grid>
  );
};

