import React from 'react';
import { Meta, Story } from '@storybook/react';
import { DatePicker, DatePickerProps } from '../../src/components/pickers';
import moment from 'moment';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'pickers/DateTimePicker',
  component: DatePicker,
  argTypes: {
    onChange: { action: 'click' },
  },
} as Meta<DatePickerProps>;

export const DateTime: Story<DatePickerProps> = (args) => <DatePicker {...args} />;
DateTime.args = {
  value: moment(new Date()),
};
