import React from 'react';
import {
  FormControlProps,
} from '@mui/material/FormControl';
import { FormNodeType } from './useFormState';
import { InputString } from './InputString';

export interface InputDateProps extends Partial<Omit<FormControlProps<any, 'div'>, 'title' | 'component' | 'error' | 'children'>> {
  nameid: string;
  title?: string;
  value: string;
  setValue: (value: string) => void;
  setValid?: (valid: boolean) => void;
  emptyMessage?: string;
  required?: boolean;
  showError?: boolean;
}

export function InputDate({
  nameid,
  title,
  label,
  value,
  setValue,
  setValid,
  emptyMessage = 'Please select an option',
  required = true,
  showError = false,
  margin = 'normal',
  fullWidth = true,
}: InputDateProps) {
  
  const [, setError] = React.useState(required ? emptyMessage : '');

  const validate = React.useCallback(
    (input: FormNodeType): boolean => {
      if (required && (input === '' || input == null)) {
        setError(emptyMessage);
        return false;
      }

      setError('');
      return true;
    },
    [required, emptyMessage]
  );

  React.useEffect(() => {
    if (setValid) setValid(validate(value));
    else validate(value);
  }, [value, validate, setValid]);

  return (
    <InputString
      fullWidth={fullWidth}
      margin={margin}
      nameid={nameid}
      title={title || ''}
      label={label}
      value={value}
      setValue={setValue}
      required={required}
      emptyMessage={'empty message'}
      showError={showError}
    />
  );
}
