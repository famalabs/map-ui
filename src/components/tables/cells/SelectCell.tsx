import React from 'react';
import { ColumnInterfaceBasedOnValue } from 'react-table';
import  Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const Div = styled('div')``;
const ALL_TYPES = ['success', 'error', 'warning', 'normal'] as const;
type SelectTypes = typeof ALL_TYPES[number];

export interface SelectCellOption {
  id: string;
  Content?: React.ReactNode;
  type?: SelectTypes;
}

export const SelectCell = (options) => ({ value }) => {
  const option = options.find((opt) => opt.id === value)

  if (value == null) return null;

    return (
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Div sx={{
           paddingLeft: '10px !important',
           paddingRight: '10px !important',
           paddingVertical: 5,
           width: 'auto',
           textAlign: 'center',
           //borderWidth: 3,
           //borderStyle: 'solid',
           borderRadius: 20,
           color: (theme) => theme.palette.primary.main,
          backgroundColor: (theme) => theme.palette.primary.main + '33',
           ...(option?.type === 'error' && {
            color: (theme) => theme.palette.error.main,
            backgroundColor: (theme) => theme.palette.error.main + '33',
           }),
           ...(option?.type === 'warning' && {
            color: (theme) => theme.palette.secondary.main,
            backgroundColor: (theme) => theme.palette.warning.main + '33',
           }),
           ...(option?.type === 'success' && {
            color: (theme) => theme.palette.success.main,
            backgroundColor:(theme) => theme.palette.success.main + '33',
           }),
        }}>
          {option?.Content || value}
        </Div>
      </Box>
    );
};
