import React from 'react';
import { TextField, BaseTextFieldProps } from '@mui/material';
import { FormNodeValidator } from './useFormState';

export type NumberValidator = FormNodeValidator<number>;

export interface InputNumberProps
  extends Omit<BaseTextFieldProps, 'value' | 'onChange' | 'error' | 'helperText' | 'type'> {
  nameid: string;
  value: number | null;
  setValue: (text: number) => void;
  setValid?: (valid: boolean) => void;
  emptyMessage?: string;
  defaultErrorMessage?: string;
  validators?: NumberValidator[];
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  showError?: boolean;
}

const emptyValidators: any = [];

export const InputNumber: React.VFC<InputNumberProps> = ({
  nameid,
  value,
  setValue,
  setValid,
  emptyMessage = 'You cannot leave this field empty',
  defaultErrorMessage = 'Invalid input',
  validators = emptyValidators,
  variant = 'outlined',
  margin = 'normal',
  fullWidth = true,
  label,
  required = true,
  onBlur,
  showError = false,
  ...props
}) => {
  const [error, setError] = React.useState(required ? emptyMessage : '');
  const [showErr, setShowErr] = React.useState(false);
  React.useEffect(() => {
    if (showError) setShowErr(true);
  }, [showError]);

  const validate = React.useCallback(
    (input: number): boolean => {
      if (required && input == null) {
        setError(emptyMessage);
        return false;
      }
      for (const validator of validators) {
        if (!validator.f(input)) {
          setError(validator.message ?? defaultErrorMessage);
          return false;
        }
      }

      setError('');
      return true;
    },
    [required, emptyMessage, validators, defaultErrorMessage]
  );

  React.useEffect(() => {
    if (setValid) setValid(validate(value));
    else validate(value);
  }, [value, validate, setValid]);

  return (
    <TextField
      variant={variant}
      margin={margin}
      fullWidth={fullWidth}
      id={nameid}
      // label={label ?? nameid.toUpperCase()}
      label={label}
      name={nameid}
      required={required}
      {...props}
      value={value ?? ''}
      type="number"
      onChange={(event) => setValue(event.target.value === '' ? null : Number(event.target.value))}
      onBlur={(e) => {
        setShowErr(true);
        if (onBlur) onBlur(e);
      }}
      error={showErr && !!error}
      helperText={showErr ? error : ''}
    />
  );
};
