import React from 'react';
import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers/DatePicker';

const defaultProps: Partial<any> = {
  disablePast: true,
  format: 'DD/MM/YYYY',
};

export type DatePickerProps = MuiDatePickerProps<any>;
export const DatePicker: React.VFC<DatePickerProps> = ({ ...props }) => (
  <MuiDatePicker
    {...defaultProps}
    {...props}
  />
);

