import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ResetPswRequest, ResetPswRequestProps } from '@src/components/auth';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'auth/ResetPswRequest',
  component: ResetPswRequest,
  argTypes: {},
} as Meta<ResetPswRequestProps>;

const Template: Story<ResetPswRequestProps> = (args) => <ResetPswRequest {...args} />;

export const Primary: Story<ResetPswRequestProps> = Template.bind({});
Primary.args = {
  loading: false,
};
