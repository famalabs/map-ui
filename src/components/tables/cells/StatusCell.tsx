import Grid from '@mui/material/Grid';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import { Activity, CheckCircle2, Clock, XCircle } from 'lucide-react';
import React from 'react';

export const ALL_STATUS = ['pending', 'active', 'terminated', 'canceled'] as const;
export type IStatus = (typeof ALL_STATUS)[number];

function isStatus(status: IStatus | string): status is IStatus {
  return ALL_STATUS.some((value) => value === status);
}

const statusMap = {
  canceled: <XCircle />,
  active: <Activity />,
  pending: <Clock />,
  terminated: <CheckCircle2 />,
};

export const StatusCell = (
  tooltip?: (value: IStatus) => string,
  tooltipProps?: Omit<TooltipProps, 'title' | 'children'>,
) => {
  const StatusCellComponent = ({ cellValue }: { cellValue: string }): React.ReactNode => {
    if (typeof cellValue === 'undefined' || cellValue === null || !isStatus(cellValue)) {
      return <Grid container>{''}</Grid>;
    }

    const statusIcon = statusMap[cellValue];

    return (
      <Grid container>
        <Tooltip title={tooltip?.(cellValue)} {...tooltipProps}>
          {statusIcon}
        </Tooltip>
      </Grid>
    );
  };
  StatusCellComponent.displayName = 'StatusCellComponent';
  return StatusCellComponent;
};
