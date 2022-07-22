import React from 'react';
import { Meta, Story } from '@storybook/react';
import { DateTimePicker, DateTimePickerProps } from '@src/components/pickers';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'pickers/DateTimePicker',
  component: DateTimePicker,
  argTypes: {
    onChange: { action: 'click' },
  },
} as Meta<DateTimePickerProps>;

export const DateTime: Story<DateTimePickerProps> = (args) => <DateTimePicker {...args} />;
DateTime.args = {
  value: new Date(),
};
