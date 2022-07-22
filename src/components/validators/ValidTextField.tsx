import React from 'react';
import { TextField, BaseTextFieldProps } from '@mui/material';

export type TextValidator = {
  f: (text: string) => boolean;
  message?: string;
};

export interface ValidTextFieldProps extends Partial<BaseTextFieldProps> {
  nameid: string;
  value: string;
  setValue: (text: string) => void;
  setValid?: (valid: boolean) => void;
  emptyMessage?: string;
  defaultErrorMessage?: string;
  validators?: TextValidator[];
}

const emptyValidators: any = [];

export const ValidTextField: React.FC<ValidTextFieldProps> = ({
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
  ...props
}) => {
  const [error, setError] = React.useState(required ? emptyMessage : '');
  const [showError, setShowError] = React.useState(false);

  const validate = React.useCallback(
    (text: string): boolean => {
      if (required && (text === '' || text == null)) {
        setError(emptyMessage);
        return false;
      }
      if (!!text) {
        for (const validator of validators) {
          if (!validator.f(text)) {
            setError(validator.message ?? defaultErrorMessage);
            return false;
          }
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
      value={value}
      onChange={(event) => {
        const text = event.target.value;
        if (!!error) validate(text);
        setValue(text);
      }}
      onBlur={() => setShowError(true)}
      error={showError && !!error}
      helperText={showError ? error : ''}
    />
  );
};
