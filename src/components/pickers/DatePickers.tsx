import React from 'react';
import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers/DatePicker';

import { InputAdornment, IconButton, TextField } from '@mui/material';
import { Today } from '@mui/icons-material';

const defaultProps: Partial<any> = {
  disablePast: true,
  format: 'DD/MM/yyyy',
};

export type DatePickerProps = MuiDatePickerProps<any, any>;
export const DatePicker: React.VFC<DatePickerProps> = ({ ...props }) => (
  <MuiDatePicker
    renderInput={(params) => <TextField {...params} />}
    {...defaultProps}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton>
            <Today />
          </IconButton>
        </InputAdornment>
      ),
    }}
    {...props}
  />
);

