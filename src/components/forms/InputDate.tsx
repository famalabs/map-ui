import React from 'react';
import {
  FormControl,
  FormControlProps,
  FormControlTypeMap,
  FormLabel,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  FormGroup,
  TextField,
} from '@mui/material';
import { FormNodeType } from './useFormState';
import { MobileDatePicker } from '@mui/x-date-pickers';


interface InputDateProps extends Partial<Omit<FormControlProps<any, 'div'>, 'title' | 'component' | 'error' | 'children'>> { 
    nameid: string;
    title?: React.ReactNode;
    value: boolean;
    setValue: (value: boolean) => void;
    setValid?: (valid: boolean) => void;
    emptyMessage?: string;
    required?: boolean;
    showError?: boolean;
}

export function InputDate({
  nameid,
  title,
  value,
  setValue,
  setValid,
  emptyMessage = 'Please select an option',
  required = true,
  showError = false,
  margin = 'normal',
  fullWidth = true,
  ...props
}: InputDateProps) {
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

//   const idxValue = React.useMemo(() => options.findIndex((opt) => opt.value === value), [value, options]);

  React.useEffect(() => {
    if (setValid) setValid(validate(value));
    else validate(value);
  }, [value, validate, setValid]);

  return (
        <div>
          {title === '' ? null : <FormLabel component="legend">{title ?? nameid}</FormLabel>}
          <MobileDatePicker
              label=""
              inputFormat="YYYYY-MM-DD"
              // inputFormat="MM/DD/YYYY"
              value={value}
              onChange={((value:boolean)=>console.log(value))}
              renderInput={(params) => <TextField {...params} />}
          />
        </div>
    // <FormControl
    //   component="fieldset"
    //   error={showError && !!error}
    //   margin={margin}
    //   fullWidth={fullWidth}
    //   {...props}
    // >
    //   {title === '' ? null : <FormLabel component="legend">{title ?? nameid}</FormLabel>}
    //   <RadioGroup
    //     name={nameid}
    //     aria-label={nameid}
    //     value={idxValue}
    //     onChange={(e, v) => {
    //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //       // @ts-ignore
    //       setValue(options[v].value);
    //     }}
    //   >
    //     {options.map((opt, idx) => (
    //       <FormControlLabel key={idx} value={idx} control={<Radio />} label={opt.label} />
    //     ))}
    //   </RadioGroup>
    //   <FormHelperText>{showError ? error : ''}</FormHelperText>
    // </FormControl>
  );
}
