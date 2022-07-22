import React from 'react';
import { Meta, Story } from '@storybook/react';
import { AuthSuccess, AuthSuccessProps } from '@src/components/auth';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'auth/Success',
  component: AuthSuccess,
  argTypes: {},
} as Meta<AuthSuccessProps>;

const Template: Story<AuthSuccessProps> = (args) => <AuthSuccess {...args} />;

export const Primary: Story<AuthSuccessProps> = Template.bind({});
Primary.args = {};
