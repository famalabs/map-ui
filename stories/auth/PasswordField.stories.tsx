import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PasswordField, PasswordFieldProps } from '../../src/components/auth';

const meta: Meta<typeof PasswordField> = { component: PasswordField };
export default meta;

type Story = StoryObj<PasswordFieldProps>;

export const AuthSuccessTemplate: Story = {

  args: {
    title: 'Password',
    fullWidth: true,
  },

  render: (args) => {
    return <PasswordField {...args} />
  }
};
