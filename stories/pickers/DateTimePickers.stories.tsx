import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Meta, StoryFn } from '@storybook/react';
import dayjs from 'dayjs';
import { DatePicker, DatePickerProps } from '../../src/components/pickers';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'pickers/DateTimePicker',
  component: DatePicker,
  argTypes: {
    onChange: { action: 'click' },
  },
} as Meta<DatePickerProps>;

export const DateTime: StoryFn<DatePickerProps> = (args) => {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker {...args} />
    </LocalizationProvider>
  );
};

DateTime.args = {
  value: dayjs(new Date()),
};
