import React from 'react';
import { Meta, Story } from '@storybook/react';
import { RegisterForm, RegisterFormProps } from '../../src/components/auth';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'auth/RegisterForm',
  component: RegisterForm,
  argTypes: {},
} as Meta<RegisterFormProps>;

const Template: Story<RegisterFormProps> = (args) => <RegisterForm {...args} />;

export const WithRoles: Story<RegisterFormProps> = Template.bind({});
WithRoles.args = {
  loading: false,
  roles: ['user', 'admin', 'publisher', 'god', 'manteiner'],
};

export const NoRoles: Story<RegisterFormProps> = Template.bind({});
NoRoles.args = {
  loading: false,
};

export const OneRoles: Story<RegisterFormProps> = Template.bind({});
OneRoles.args = {
  loading: false,
  roles: ['unlucky'],
};
