import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ResetPsw, ResetPswProps } from '@src/components/auth';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'auth/ResetPsw',
  component: ResetPsw,
  argTypes: {},
} as Meta<ResetPswProps>;

const Template: Story<ResetPswProps> = (args) => <ResetPsw {...args} />;

export const Primary: Story<ResetPswProps> = Template.bind({});
Primary.args = {
  loading: false,
};
