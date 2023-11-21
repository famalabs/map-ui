import React from 'react';
import FormControl, {FormControlProps} from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormHelperText from '@mui/material/FormHelperText';

import { FormNodeType } from './useFormState';

export type Option<T extends FormNodeType> = {
  value: T;
  label: React.ReactNode;
};

interface InputRadioPropsGeneric<T extends FormNodeType>
  extends Partial<Omit<FormControlProps<any, 'div'>, 'title' | 'component' | 'error' | 'children'>> {
  nameid: string;
  title?: React.ReactNode;
  value: T | null;
  options: Option<T>[];
  setValue: (value: T) => void;
  setValid?: (valid: boolean) => void;
  emptyMessage?: string;
  required?: boolean;
  showError?: boolean;
}

export type InputRadioProps =
  | InputRadioPropsGeneric<string>
  | InputRadioPropsGeneric<number>
  | InputRadioPropsGeneric<boolean>;

export function InputRadio({
  nameid,
  title,
  value,
  setValue,
  options,
  setValid,
  emptyMessage = 'Please select an option',
  required = true,
  showError = false,
  margin = 'normal',
  fullWidth = true,
  ...props
}: InputRadioProps) {
  const [error, setError] = React.useState(required ? emptyMessage : '');

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

  const idxValue = React.useMemo(() => options.findIndex((opt) => opt.value === value), [value, options]);

  React.useEffect(() => {
    if (setValid) setValid(validate(value));
    else validate(value);
  }, [value, validate, setValid]);

  return (
    <FormControl
      component="fieldset"
      error={showError && !!error}
      margin={margin}
      fullWidth={fullWidth}
      {...props}
    >
      {title === '' ? null : <FormLabel component="legend">{title ?? nameid}</FormLabel>}
      <RadioGroup
        name={nameid}
        aria-label={nameid}
        value={idxValue}
        onChange={(e, v) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setValue(options[v].value);
        }}
      >
        {options.map((opt, idx) => (
          <FormControlLabel key={idx} value={idx} control={<Radio />} label={opt.label} />
        ))}
      </RadioGroup>
      <FormHelperText>{showError ? error : ''}</FormHelperText>
    </FormControl>
  );
}
