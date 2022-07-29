import React from 'react';
import { ColumnInterfaceBasedOnValue } from 'react-table';
import {  Theme, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const Div = styled('div')``;
const ALL_TYPES = ['success', 'error', 'warning', 'normal'] as const;
type SelectTypes = typeof ALL_TYPES[number];

export interface SelectCellOption {
  id: string;
  Content?: React.ReactNode;
  type?: SelectTypes;
}

// @ts-ignore
export const SelectCell: <T extends Record<string, any>>(options: SelectCellOption[]) => Extract<ColumnInterfaceBasedOnValue<T, string>['Cell'], React.FC> = (options) => ({ value }) => {
  const option = options.find((opt) => opt.id === value)

  if (value == null) return null;

    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Div sx={{
           paddingLeft: 10,
           paddingRight: 10,
           paddingVertical: 5,
           width: 'auto',
           textAlign: 'center',
           //borderWidth: 3,
           //borderStyle: 'solid',s
           borderRadius: 20,
           color: (theme:Theme) => theme.palette.primary.main,
          backgroundColor: (theme:Theme) => theme.palette.primary.main + '33',
           ...(option?.type === 'error' && {
            color: (theme:Theme) => theme.palette.error.main,
            backgroundColor: (theme:Theme) => theme.palette.error.main + '33',
           }),
           ...(option?.type === 'warning' && {
            color: (theme:Theme) => theme.palette.secondary.main,
            backgroundColor: (theme:Theme) => theme.palette.warning.main + '33',
           }),
           ...(option?.type === 'success' && {
            color: (theme:Theme) => theme.palette.success.main,
            backgroundColor:(theme:Theme) => theme.palette.success.main + '33',
           }),
        }}>
          {option?.Content || value}
        </Div>
      </Box>
    );
};
