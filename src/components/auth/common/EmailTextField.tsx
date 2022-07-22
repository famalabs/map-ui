import React from 'react';
import { ValidTextField, checkValidEmail, ValidTextFieldProps } from '../../validators';

export interface EmailTextFieldProps extends Omit<ValidTextFieldProps, 'nameid'> {}

export const EmailTextField: React.VFC<EmailTextFieldProps> = ({
  value,
  setValue,
  setValid,
  label = 'Email',
  emptyMessage = 'You cannot leave this field empty',
  defaultErrorMessage = 'Write a valid email address',
  ...props
}) => {
  return (
    <>
      <ValidTextField
        value={value}
        setValue={setValue}
        setValid={setValid}
        nameid="email"
        autoComplete="email"
        type="email"
        label={label}
        emptyMessage={emptyMessage}
        defaultErrorMessage={defaultErrorMessage}
        validators={[{ f: checkValidEmail }]}
        {...props}
      />
    </>
  );
};
