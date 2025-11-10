import { Meta, StoryObj } from '@storybook/react-vite';
import { AuthSuccess, AuthSuccessProps } from '../../src/components/auth';

const meta: Meta<typeof AuthSuccess> = { component: AuthSuccess };
export default meta;

type Story = StoryObj<AuthSuccessProps>;

export const AuthSuccessTemplate: Story = {
  args: {
    success: 'Login effettuato',
    error: 'Errore nel login',
    title: 'Login',
  },

  render: (args) => {
    return <AuthSuccess {...args} />;
  },
};
