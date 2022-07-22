import React from 'react';
import { ValidTextField, ValidTextFieldProps, TextValidator } from  '../../validators';
import { checkStrongPsw, checkPswLength } from './utils';

export interface NewPswTextFieldProps extends Omit<ValidTextFieldProps, 'nameid'> {
  label?: string;
  confirm?: boolean;
  firstPsw?: string;
  emptyFieldText?: string;
  weakPswText?: string;
  shortPswText?: string;
  wrongConfirmPswText?: string;
}

export const NewPswTextField: React.FC<NewPswTextFieldProps> = ({
  value,
  setValue,
  setValid,
  label = 'New Password',
  confirm = false,
  firstPsw,
  emptyFieldText = 'You cannot leave this field empty',
  weakPswText = 'Password too weak',
  shortPswText = 'Password too short',
  wrongConfirmPswText = 'Password and confirmation password do not match',
  ...props
}) => {
  const psw2Validator: TextValidator = React.useMemo(
    () => ({
      f: (text) => text === firstPsw,
      message: wrongConfirmPswText,
    }),
    [firstPsw, wrongConfirmPswText]
  );

  return (
    <>
      <ValidTextField
        value={value}
        setValue={setValue}
        setValid={setValid}
        nameid={confirm ? 'password2' : 'password'}
        type="password"
        autoComplete="new-password"
        label={label}
        emptyMessage={emptyFieldText}
        validators={
          confirm
            ? [psw2Validator]
            : [
                { f: checkStrongPsw, message: weakPswText },
                { f: checkPswLength, message: shortPswText },
              ]
        }
        {...props}
      />
    </>
  );
};
