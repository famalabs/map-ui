import Grid from '@mui/material/Grid';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import { CircleCheckIcon, CircleXIcon } from 'lucide-react';
import React from 'react';

export const BooleanCell = (
  toolTip?: (value: string) => string,
  tooltipProps?: Omit<TooltipProps, 'title' | 'children'>,
) => {
  const Renderer = ({ cellValue }: { cellValue: any }): React.ReactNode => {
    if (typeof cellValue === 'undefined' || cellValue === null) {
      return <Grid container>{''}</Grid>;
    }

    return (
      <Grid>
        <Tooltip title={toolTip && toolTip(cellValue)} {...tooltipProps}>
          {cellValue ? <CircleCheckIcon size={20} /> : <CircleXIcon size={20} />}
        </Tooltip>
      </Grid>
    );
  };
  Renderer.displayName = 'BooleanCell';
  return Renderer;
};
