import React from 'react';
import { TextField, BaseTextFieldProps } from '@mui/material';
import { FormNodeValidator } from './useFormState';

export type StringValidator = FormNodeValidator<string>;

export interface InputStringProps
  extends Omit<BaseTextFieldProps, 'value' | 'onChange' | 'error' | 'helperText'> {
  nameid: string;
  value: string | null;
  setValue: (text: string) => void;
  setValid?: (valid: boolean) => void;
  emptyMessage?: string;
  defaultErrorMessage?: string;
  validators?: StringValidator[];
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  showError?: boolean;
}

const emptyValidators: any = [];

export const InputString: React.VFC<InputStringProps> = ({
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
  const [showErr, setShowErr] = React.useState(showError);
  React.useEffect(() => {
    if (showError) setShowErr(true);
  }, [showError]);

  const validate = React.useCallback(
    (text: string): boolean => {
      if (required && (text === '' || text == null)) {
        setError(emptyMessage);
        return false;
      }
      for (const validator of validators) {
        if (!validator.f(text)) {
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
      label={label ?? nameid.toUpperCase()}
      name={nameid}
      required={required}
      {...props}
      value={value ?? ''}
      onChange={(event) => setValue(event.target.value)}
      onBlur={(e) => {
        setShowErr(true);
        if (onBlur) onBlur(e);
      }}
      error={showErr && !!error}
      helperText={showErr ? error : ''}
    />
  );
};
