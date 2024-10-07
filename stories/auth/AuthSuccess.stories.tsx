import React from 'react';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { AuthSuccess, AuthSuccessProps } from '../../src/components/auth';

const meta: Meta<typeof AuthSuccess> = { component: AuthSuccess };
export default meta;

type Story = StoryObj<AuthSuccessProps>;

export const AuthSuccessTemplate: Story = {

  args: {
    success: "Login effettuato",
    title: "Login",
  },

  render: (args) => {
    return <AuthSuccess {...args} />
  }
};
