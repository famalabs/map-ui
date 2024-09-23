import React from 'react';
import { Meta, Story } from '@storybook/react';
import { DatePicker, DatePickerProps } from '../../src/components/pickers';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'pickers/DateTimePicker',
  component: DatePicker,
  argTypes: {
    onChange: { action: 'click' },
  },
} as Meta<DatePickerProps>;

export const DateTime: Story<DatePickerProps> = (args) => {

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker {...args} />
    </LocalizationProvider>
  )
};

DateTime.args = {
  value: moment(new Date()),
};
