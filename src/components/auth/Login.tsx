import React from 'react';
import { Grid, Link } from '@mui/material';
import { ValidTextField, useValidatorState } from '../validators';
import { AuthContainer, AuthForm, EmailTextField, SubmitButton } from './common';
import { ButtonLoading } from '../simple';

export interface LoginFormProps {
  onSubmit: (email: string, psw: string) => void;
  error?: string;
  loading: boolean;
  title?: string;
  submitButtonText?: string;
  wrongEmailText?: string;
  emptyFieldText?: string;
  onForgotPswClick?: () => void;
  forgotPswText?: string;
  onSignupClick?: () => void;
  signupText?: string;
  emailVerificationText?: string;
  onEmailVerificationClick?: (email: string) => void;
}

export const LoginForm: React.VFC<LoginFormProps> = ({
  loading,
  error,
  onSubmit,
  title = 'Login',
  submitButtonText = 'Login',
  wrongEmailText = 'Write a valid email address',
  emptyFieldText = 'You cannot leave this field empty',
  forgotPswText = 'Forgot password?',
  signupText = "Don't have an account? Sign Up",
  emailVerificationText = 'Verify your email',
  onForgotPswClick,
  onSignupClick,
  onEmailVerificationClick,
}) => {
  const [email, setEmail] = React.useState('');
  const [psw, setPsw] = React.useState('');
  const { allValid, setValid } = useValidatorState(['email', 'psw']);

  return (
    <AuthContainer title={title} error={error}>
      {onEmailVerificationClick && error && (
        <Grid item>
          <ButtonLoading
            loading={loading}
            variant="contained"
            color="secondary"
            onClick={() => onEmailVerificationClick(email)}
            label={emailVerificationText}
          />
        </Grid>
      )}

      <AuthForm onSubmit={() => onSubmit(email, psw)}>
        <EmailTextField
          value={email}
          setValue={setEmail}
          setValid={setValid('email')}
          emptyMessage={emptyFieldText}
          defaultErrorMessage={wrongEmailText}
        />

        <ValidTextField
          nameid="password"
          value={psw}
          setValue={setPsw}
          setValid={setValid('psw')}
          label="Password"
          type="password"
          autoComplete="current-password"
          emptyMessage={emptyFieldText}
        />

        <SubmitButton loading={loading} validForm={allValid} label={submitButtonText} />
      </AuthForm>

      <Grid container>
        <Grid item xs>
          {onForgotPswClick && (
            <Link onClick={onForgotPswClick} component="button" color="secondary">
              {forgotPswText}
            </Link>
          )}
        </Grid>
        <Grid item>
          {onSignupClick && (
            <Link onClick={onSignupClick} component="button" color="secondary">
              {signupText}
            </Link>
          )}
        </Grid>
      </Grid>
    </AuthContainer>
  );
};
