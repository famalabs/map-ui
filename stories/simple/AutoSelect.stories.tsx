import React from 'react';
import { Meta, Story } from '@storybook/react';
import { AutoSelect, AutoSelectProps } from '@src/components/simple';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'simple/AutoSelect',
  component: AutoSelect,
  argTypes: {},
} as Meta<AutoSelectProps>;

const Template: Story<AutoSelectProps> = (args) => (
  <div style={{ width: 200 }}>
    <AutoSelect {...args} />
  </div>
);

export const Primary: Story<AutoSelectProps> = Template.bind({});
Primary.args = {
  title: 'Color',
  options: [
    { id: 'red', label: 'Red' },
    { id: 'blue', label: 'Blue' },
    { id: 'green', label: 'Green' },
  ],
};
