import React from 'react';
import {
  DateTimePicker as MuiDateTimePicker,
  DateTimePickerProps as MuiDateTimePickerProps,
} from '@mui/lab';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Today } from '@mui/icons-material';

const defaultProps: Partial<MuiDateTimePickerProps<any>> = {
  ampm: false,
  disablePast: true,
  minutesStep: 5,
};

export type DateTimePickerProps = MuiDateTimePickerProps<any>;
export const DateTimePicker: React.VFC<DateTimePickerProps> = ({ ...props }) => (
  <MuiDateTimePicker
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