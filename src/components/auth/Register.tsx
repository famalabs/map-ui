import React from 'react';
import { MenuItem } from '@mui/material';
import { ValidTextField, checkValidEmail, useValidatorState } from '../validators';
import { AuthContainer, AuthForm, EmailTextField, NewPswTextField, SubmitButton } from './common';

export interface RegisterFields {
  name: string;
  surname: string;
  role?: string;
  email: string;
  psw: string;
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterFields) => void;
  roles?: string[];
  error?: string;
  loading: boolean;
  title?: string;
  nameLabel?: string;
  surnameLabel?: string;
  roleLabel?: string;
  confirmPswLabel?: string;
  submitButtonText?: string;
  wrongEmailText?: string;
  emptyFieldText?: string;
  weakPswText?: string;
  shortPswText?: string;
  wrongConfirmPswText?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
                                                            onSubmit,
                                                            roles,
                                                            loading,
                                                            error,
                                                            title = 'Register',
                                                            nameLabel = 'Name',
                                                            surnameLabel = 'Surname',
                                                            roleLabel = 'Role',
                                                            confirmPswLabel = 'Confirm Password',
                                                            submitButtonText = 'Sign Up',
                                                            wrongEmailText = 'Write a valid email address',
                                                            emptyFieldText = 'You cannot leave this field empty',
                                                            weakPswText = 'Password too weak',
                                                            shortPswText = 'Password too short',
                                                            wrongConfirmPswText = 'Password and confirmation password do not match'
                                                          }) => {
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('');
  const [psw, setPsw] = React.useState('');
  const [psw2, setPsw2] = React.useState('');
  const { allValid, setValid } = useValidatorState(['name', 'surname', 'email', 'role', 'psw', 'psw2']);

  const onSubmitClick = React.useCallback(() => {
    const user: RegisterFields = { name, surname, email, psw };
    if (roles?.length > 0) user.role = role;
    onSubmit(user);
  }, [name, surname, email, role, psw, onSubmit, roles]);

  React.useEffect(() => {
    if (typeof roles === 'undefined' || roles.length === 0) setValid('role')(true);
    else if (roles.length === 1) {
      setRole(roles[0]);
      setValid('role')(true);
    }
  }, [roles]);

  return (
    <AuthContainer title={title} error={error}>
      <AuthForm onSubmit={onSubmitClick}>
        <ValidTextField
          nameid="name"
          value={name}
          setValue={setName}
          setValid={setValid('name')}
          label={nameLabel}
          autoComplete="given-name"
          emptyMessage={emptyFieldText}
        />

        <ValidTextField
          nameid="surname"
          value={surname}
          setValue={setSurname}
          setValid={setValid('surname')}
          label={surnameLabel}
          autoComplete="family-name"
          emptyMessage={emptyFieldText}
        />

        {roles?.length > 0 && (
          <ValidTextField
            nameid="role"
            value={role}
            setValue={setRole}
            setValid={setValid('role')}
            label={roleLabel}
            emptyMessage={emptyFieldText}
            disabled={roles.length === 1}
            select
          >
            {roles.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </ValidTextField>
        )}

        <EmailTextField
          value={email}
          setValue={setEmail}
          setValid={setValid('email')}
          label="Email"
          emptyMessage={emptyFieldText}
          defaultErrorMessage={wrongEmailText}
        />

        <NewPswTextField
          value={psw}
          setValue={setPsw}
          setValid={setValid('psw')}
          label="Password"
          emptyMessage={emptyFieldText}
          weakPswText={weakPswText}
          shortPswText={shortPswText}
        />

        <NewPswTextField
          value={psw2}
          setValue={setPsw2}
          setValid={setValid('psw2')}
          label={confirmPswLabel}
          emptyMessage={emptyFieldText}
          confirm
          firstPsw={psw}
          wrongConfirmPswText={wrongConfirmPswText}
        />

        <SubmitButton validForm={allValid} loading={loading} label={submitButtonText} />
      </AuthForm>
    </AuthContainer>
  );
};
