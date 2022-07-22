import React from 'react';
import { Meta, Story } from '@storybook/react';
import { LoginForm, LoginFormProps } from '@src/components/auth';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'auth/LoginForm',
  component: LoginForm,
  argTypes: {},
} as Meta<LoginFormProps>;

const Template: Story<LoginFormProps> = (args) => <LoginForm {...args} />;

export const Primary: Story<LoginFormProps> = Template.bind({});
Primary.args = {
  loading: false,
};
