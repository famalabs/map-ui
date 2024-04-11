import React from 'react';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export const BooleanCell = (
  toolTip?: (value) => string,
  tooltipProps?: Omit<TooltipProps, 'title' | 'children'>
) => ({ cellValue }: { cellValue: any }) => {
  
  if (typeof cellValue === 'undefined' || cellValue === null) return null;

  return (
    <Tooltip title={toolTip && toolTip(cellValue)} {...tooltipProps}>
      {cellValue ? <CheckCircleIcon /> : <ErrorIcon />}
    </Tooltip>
  );
};

