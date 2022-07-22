import React from 'react';
import { AuthContainer, AuthForm, EmailTextField, SubmitButton } from './common';

export interface AuthSuccessProps {
  error?: string;
  success?: string;
  title?: string;
}

export const AuthSuccess: React.FC<AuthSuccessProps> = ({
  error,
  title = 'Operation Completed',
  success = 'Operation completed successfully',
}) => {
  return (
    <AuthContainer title={title} error={error}>
      <p style={{ color: 'green' }}>{success}</p>
    </AuthContainer>
  );
};
