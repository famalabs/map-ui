import React from 'react';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Grid2 from '@mui/material/Unstable_Grid2';

export const BooleanCell = (
  toolTip?: (value) => string,
  tooltipProps?: Omit<TooltipProps, 'title' | 'children'>
) => ({ cellValue }: { cellValue: any }) => {

  if (typeof cellValue === 'undefined' || cellValue === null) {
    return (
      <Grid2 container>
        {''}
      </Grid2>
    )
  }

  return (
    <Grid2>
      <Tooltip title={toolTip && toolTip(cellValue)} {...tooltipProps}>
        {cellValue ? <CheckCircleIcon /> : <ErrorIcon />}
      </Tooltip>
    </Grid2>
  );
};

