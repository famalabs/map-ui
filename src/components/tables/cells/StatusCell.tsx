import React from 'react';
import { ColumnInterfaceBasedOnValue } from 'react-table';
import { Tooltip, TooltipProps } from '@mui/material';
import { CancelPresentation } from '@mui/icons-material';
import { Rowing } from '@mui/icons-material';
import { HourglassEmpty } from '@mui/icons-material';
import { AssignmentTurnedIn } from '@mui/icons-material';

export const ALL_STATUS = ['pending', 'active', 'terminated', 'canceled'] as const;
export type IStatus = typeof ALL_STATUS[number];

function isStatus(status: IStatus | string): status is IStatus {
  return ALL_STATUS.some((value) => value === status);
}

export const StatusCell = (
  tooltip?: (value: IStatus) => string,
  tooltipProps?: Omit<TooltipProps, 'title' | 'children'>
) => ({ value }) => {
  if (typeof value === 'undefined') return null;
  if (!isStatus(value))
    throw new Error(`Status passed '${value}' is not a valid status string (${ALL_STATUS.join('|')})`);

  const DivTip: ({ children }: { children: TooltipProps['children'] }) => JSX.Element = tooltip
    ? ({ children }) => (
        <Tooltip title={tooltip(value)} {...tooltipProps}>
          {children}
        </Tooltip>
      )
    : ({ children }) => <>{children}</>;

  let StatusComp: React.ReactNode = '';
  switch (value) {
    case 'canceled':
      StatusComp = <CancelPresentation />;
      break;
    case 'active':
      StatusComp = <Rowing />;
      break;
    case 'pending':
      StatusComp = <HourglassEmpty />;
      break;
    case 'terminated':
      StatusComp = <AssignmentTurnedIn />;
      break;
  }
  return (
    <DivTip>
      <span>{StatusComp}</span>
    </DivTip>
  );
};
