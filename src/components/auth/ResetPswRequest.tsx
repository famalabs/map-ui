import React from 'react';
import { AuthContainer, AuthForm, EmailTextField, SubmitButton } from './common';

export interface ResetPswRequestProps {
  onSubmit: (email: string) => void;
  error?: string;
  loading: boolean;
  title?: string;
  submitButtonText?: string;
  wrongEmailText?: string;
  emptyFieldText?: string;
}

export const ResetPswRequest: React.VFC<ResetPswRequestProps> = ({
                                                                   loading,
                                                                   error,
                                                                   onSubmit,
                                                                   title = 'Reset Password',
                                                                   submitButtonText = 'Send reset-password request',
                                                                   wrongEmailText = 'Write a valid email address',
                                                                   emptyFieldText = 'You cannot leave this field empty'
                                                                 }) => {
  const [email, setEmail] = React.useState('');
  const [valid, setValid] = React.useState(false);

  return (
    <AuthContainer title={title} error={error}>
      <AuthForm onSubmit={() => onSubmit(email)}>
        <EmailTextField
          value={email}
          setValue={setEmail}
          setValid={setValid}
          emptyMessage={emptyFieldText}
          defaultErrorMessage={wrongEmailText}
        />

        <SubmitButton validForm={valid} loading={loading} label={submitButtonText} />
      </AuthForm>
    </AuthContainer>
  );
};
