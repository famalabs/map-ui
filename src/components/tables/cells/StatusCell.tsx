import React from 'react';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import CancelPresentation from '@mui/icons-material/CancelPresentation';
import Rowing from '@mui/icons-material/Rowing';
import HourglassEmpty from '@mui/icons-material/HourglassEmpty';
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedIn';
import Grid2 from '@mui/material/Unstable_Grid2';

export const ALL_STATUS = ['pending', 'active', 'terminated', 'canceled'] as const;
export type IStatus = typeof ALL_STATUS[number];

function isStatus(status: IStatus | string): status is IStatus {
  return ALL_STATUS.some((value) => value === status);
}

export const StatusCell = (
  tooltip?: (value: IStatus) => string,
  tooltipProps?: Omit<TooltipProps, 'title' | 'children'>
) => ({ cellValue }) => {

  if (typeof cellValue === 'undefined' || cellValue === null || !isStatus(cellValue)) {
    return (
      <Grid2 container>
        {''}
      </Grid2>
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
    <Grid2 container>
      <Tooltip title={tooltip(cellValue)} {...tooltipProps}>
        {statusIcon}
      </Tooltip>
    </Grid2>
  );
};
