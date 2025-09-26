import React from 'react';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import CancelPresentation from '@mui/icons-material/CancelPresentation';
import Rowing from '@mui/icons-material/Rowing';
import HourglassEmpty from '@mui/icons-material/HourglassEmpty';
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedIn';
import Grid from '@mui/material/Grid';

export const ALL_STATUS = ['pending', 'active', 'terminated', 'canceled'] as const;
export type IStatus = typeof ALL_STATUS[number];

function isStatus(status: IStatus | string): status is IStatus {
  return ALL_STATUS.some((value) => value === status);
}

export const StatusCell = (
  tooltip?: (value: IStatus) => string,
  tooltipProps?: Omit<TooltipProps, 'title' | 'children'>
) => ({ cellValue }: { cellValue: string }): React.ReactNode => {

  if (typeof cellValue === 'undefined' || cellValue === null || !isStatus(cellValue)) {
    return (
      <Grid container>
        {''}
      </Grid>
    )
  }

  const statusMap = {
    canceled: <CancelPresentation />,
    active: <Rowing />,
    pending: <HourglassEmpty />,
    terminated: <AssignmentTurnedIn />,
  };

  const statusIcon = statusMap[cellValue];

  return (
    <Grid container>
      <Tooltip title={tooltip?.(cellValue)} {...tooltipProps}>
        {statusIcon}
      </Tooltip>
    </Grid>
  );
};
